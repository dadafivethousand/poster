import { useEffect, useState } from "react";
import sourceSrc from "../source";

/**
 * Loads the submitted reference image and hands a poster two independent
 * things, either of which it may use on its own:
 *
 *   1. THE PICTURE — `--source` (a url()) plus `--source-aspect`, for a poster
 *      that renders the image as its subject: full bleed behind a scrim, sat
 *      in a frame, duotoned, masked into a shape.
 *
 *   2. THE PALETTE — `--source-1` … `--source-5`, ordered most-used first,
 *      plus three derived roles:
 *        `--source-paper`  the lightest of them, for a ground
 *        `--source-ink`    the darkest, for type
 *        `--source-accent` the most saturated, for the one thing that pops
 *      This is the half a poster uses when the image is a STYLE reference and
 *      never appears in the artwork — the colour story still comes off it, so
 *      a hand-built composition sits in the same world as the photo.
 *
 * That split is the whole point of the hook: a poster picks picture, palette,
 * or both, and nothing here decides for it.
 *
 * Extraction is a coarse box-quantiser over a downscaled copy, not k-means:
 * a poster wants "roughly the five colours a person would name looking at
 * this", and 32-unit RGB cells give that in one pass over ~65k pixels. Near
 * blacks and near whites are held back and only used if nothing else fills the
 * list, because otherwise a photo's shadows win every slot and every palette
 * comes out grey.
 *
 * Falls back to the raw file with a neutral palette if the image can't be
 * read (a cross-origin source, a decode failure), so a poster always renders.
 */

const NEUTRAL = ["#171a1f", "#3d434d", "#7c8593", "#c3c9d2", "#f2f4f7"];

export default function useSource(src = sourceSrc) {
  const [state, setState] = useState({
    src,
    aspect: 1,
    ready: false,
    palette: NEUTRAL,
  });

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      if (cancelled) return;
      const aspect = (img.naturalWidth || 1) / (img.naturalHeight || 1);
      try {
        setState({ src, aspect, ready: true, palette: extract(img) });
      } catch {
        setState({ src, aspect, ready: true, palette: NEUTRAL });
      }
    };
    img.onerror = () => {
      if (!cancelled) setState({ src, aspect: 1, ready: true, palette: NEUTRAL });
    };

    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  const { palette } = state;
  const vars = {
    "--source": `url(${state.src})`,
    "--source-aspect": String(state.aspect),
  };
  palette.forEach((c, i) => {
    vars[`--source-${i + 1}`] = c;
  });

  // The three ROLES are only published when the image actually contains a
  // colour that can do that job, so an unqualified one falls through to the
  // poster's own `var(--source-accent, #e4002b)` fallback instead of quietly
  // being filled with something that can't perform.
  //
  // This is the same rule useLogo applies to its region masks, and it is not
  // fussiness: the dojo placeholder is a desaturated interior whose most
  // saturated colour is a warm grey, and using it as the accent rendered the
  // rule under the caption invisible. An accent that isn't an accent is worse
  // than no accent, because the fallback is brand red and brand red works.
  const paper = lightest(palette);
  const ink = darkest(palette);
  const accent = mostSaturated(palette);

  if (lum(paper) > 150) vars["--source-paper"] = paper;
  if (lum(ink) < 90) vars["--source-ink"] = ink;
  if (sat(accent) > 0.28 && lum(accent) > 40) vars["--source-accent"] = accent;

  return { ...state, sourceVar: vars };
}

/** Five representative colours, most-used first. */
function extract(img, count = 5) {
  const MAX = 256;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return NEUTRAL;

  const s = Math.min(1, MAX / Math.max(iw, ih));
  const w = Math.max(1, Math.round(iw * s));
  const h = Math.max(1, Math.round(ih * s));

  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  const bins = new Map();
  const extremes = new Map();

  for (let i = 0; i < w * h; i += 1) {
    const o = i * 4;
    if (data[o + 3] < 128) continue;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];

    // 32-unit cells: 8 levels per channel. Fine enough to keep a red and an
    // orange apart, coarse enough that a gradient doesn't shatter into 40 bins.
    const key = ((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5);
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const target = lum < 26 || lum > 232 ? extremes : bins;

    const hit = target.get(key);
    if (hit) {
      hit.r += r;
      hit.g += g;
      hit.b += b;
      hit.n += 1;
    } else {
      target.set(key, { r, g, b, n: 1 });
    }
  }

  const rank = (m) =>
    [...m.values()].sort((a, b) => b.n - a.n).map((v) => hex(
      Math.round(v.r / v.n),
      Math.round(v.g / v.n),
      Math.round(v.b / v.n)
    ));

  // Mid-tones first; top up from the extremes only if the image genuinely is
  // mostly black or mostly white, and from the neutral ramp if it is tiny.
  const out = [...rank(bins), ...rank(extremes), ...NEUTRAL].slice(0, count);
  return out.length === count ? out : NEUTRAL;
}

function hex(r, g, b) {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function rgb(c) {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lum(c) {
  const [r, g, b] = rgb(c);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function sat(c) {
  const [r, g, b] = rgb(c);
  const max = Math.max(r, g, b);
  return max === 0 ? 0 : (max - Math.min(r, g, b)) / max;
}

const lightest = (p) => [...p].sort((a, b) => lum(b) - lum(a))[0];
const darkest = (p) => [...p].sort((a, b) => lum(a) - lum(b))[0];
const mostSaturated = (p) => [...p].sort((a, b) => sat(b) - sat(a))[0];
