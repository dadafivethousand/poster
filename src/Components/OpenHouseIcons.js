// OpenHouseIcons.js — the fallback icon set for the open house poster.
//
// These exist so the poster looks FINISHED with no assets at all. Every one is
// overridden the moment a real image is passed for that slot, so they are a
// floor rather than a decision: the layout never shows a hole, and swapping in
// the licensed artwork is still one prop.
//
// Deliberately flat, bold and single-idea — they are read at 44-88px on a busy
// field, where a detailed drawing turns to mush. Minecraft and Roblox are
// stand-ins for trademarked marks and should be replaced with the real ones
// before anything is printed.
import React from "react";

const box = { viewBox: "0 0 64 64", xmlns: "http://www.w3.org/2000/svg" };

export const Calendar = () => (
  <svg {...box}>
    <rect x="6" y="12" width="52" height="46" rx="8" fill="#fff" />
    <rect x="6" y="12" width="52" height="14" rx="8" fill="#4ea936" />
    <rect x="6" y="20" width="52" height="6" fill="#4ea936" />
    <rect x="16" y="4" width="7" height="14" rx="3.5" fill="#2f7d22" />
    <rect x="41" y="4" width="7" height="14" rx="3.5" fill="#2f7d22" />
    {[0, 1, 2].map((r) =>
      [0, 1, 2, 3].map((c) => (
        <rect key={`${r}${c}`} x={13 + c * 10} y={32 + r * 8} width="7" height="6"
              rx="1.6" fill="#4ea936" />
      ))
    )}
  </svg>
);

export const Clock = () => (
  <svg {...box}>
    <circle cx="32" cy="32" r="26" fill="#fff" stroke="#7a2bbd" strokeWidth="5" />
    <path d="M32 16v17l12 7" fill="none" stroke="#7a2bbd" strokeWidth="6"
          strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Pin = () => (
  <svg {...box}>
    <path d="M32 4c-10.5 0-19 8.5-19 19 0 14 19 37 19 37s19-23 19-37c0-10.5-8.5-19-19-19z"
          fill="#c1d931" />
    <circle cx="32" cy="23" r="7.5" fill="#0b2a5b" />
  </svg>
);

export const Phone = () => (
  <svg {...box}>
    <circle cx="32" cy="32" r="28" fill="none" stroke="#c1d931" strokeWidth="5" />
    <path d="M23 18c2 0 3 1 4 3l2 4c1 2 0 3-1 4l-2 2c2 5 6 9 11 11l2-2c1-1 2-2 4-1l4 2c2 1 3 2 3 4 0 4-3 7-7 7C29 52 12 35 12 21c0-4 3-7 7-7z"
          fill="#c1d931" />
  </svg>
);

export const Gamepad = () => (
  <svg {...box}>
    <path d="M18 20h28c8 0 14 7 14 15v6c0 5-4 9-9 9-4 0-6-2-8-5H21c-2 3-4 5-8 5-5 0-9-4-9-9v-6c0-8 6-15 14-15z"
          fill="#fff" />
    <rect x="13" y="31" width="14" height="4.5" rx="2.2" fill="#7a2bbd" />
    <rect x="17.7" y="26.2" width="4.5" height="14" rx="2.2" fill="#7a2bbd" />
    <circle cx="45" cy="30" r="3.4" fill="#7a2bbd" />
    <circle cx="52" cy="37" r="3.4" fill="#7a2bbd" />
  </svg>
);

export const Gift = ({ bow = "#fff", body = "#fff", ink = "#3f9129" }) => (
  <svg {...box}>
    <rect x="7" y="26" width="50" height="32" rx="5" fill={body} />
    <rect x="4" y="17" width="56" height="12" rx="4" fill={body} />
    <rect x="27" y="17" width="10" height="41" fill={ink} />
    <path d="M32 17c-6-9-18-10-18-3 0 5 9 6 18 3zM32 17c6-9 18-10 18-3 0 5-9 6-18 3z"
          fill={bow} stroke={ink} strokeWidth="2.6" strokeLinejoin="round" />
  </svg>
);

export const Chess = () => (
  <svg {...box}>
    <path d="M32 6c4 0 7 3 7 7 0 2-1 4-3 5l3 5-4 4 4 12H25l4-12-4-4 3-5c-2-1-3-3-3-5 0-4 3-7 7-7z"
          fill="#fff" />
    <path d="M20 41h24l4 9H16z" fill="#fff" />
    <rect x="12" y="50" width="40" height="8" rx="3" fill="#fff" />
  </svg>
);

export const Bag = () => (
  <svg {...box}>
    <path d="M12 20h40l4 34c.4 3-2 6-5 6H13c-3 0-5.4-3-5-6z" fill="#0b2a5b" />
    <path d="M22 24V17c0-6 4.5-10 10-10s10 4 10 10v7" fill="none" stroke="#0b2a5b"
          strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const Laptop = () => (
  <svg {...box}>
    <rect x="9" y="12" width="46" height="32" rx="4" fill="#fff" />
    <rect x="13" y="16" width="38" height="24" rx="2" fill="#0b2a5b" />
    <path d="M25 22l-6 6 6 6M39 22l6 6-6 6M34 20l-4 16" fill="none" stroke="#c1d931"
          strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 48h56l-3 5c-.6 1-1.7 2-3 2H10c-1.3 0-2.4-1-3-2z" fill="#dfe6f0" />
  </svg>
);

export const Cube = () => (
  <svg {...box}>
    <path d="M32 6l24 12-24 12L8 18z" fill="#6cbf3f" />
    <path d="M8 18l24 12v24L8 42z" fill="#8a5a2b" />
    <path d="M56 18L32 30v24l24-12z" fill="#6b451f" />
    <path d="M32 6l24 12-24 12L8 18z" fill="none" stroke="#4b8f28" strokeWidth="1.6" />
  </svg>
);

export const Blocks = () => (
  <svg {...box}>
    <rect x="10" y="10" width="44" height="44" rx="7" transform="rotate(-9 32 32)"
          fill="#e9edf3" />
    <rect x="24" y="24" width="16" height="16" rx="2" transform="rotate(-9 32 32)"
          fill="#0b2a5b" />
  </svg>
);

export const Printer = () => (
  <svg {...box}>
    <rect x="8" y="8" width="48" height="42" rx="5" fill="none" stroke="#4aa3ff"
          strokeWidth="5" />
    <rect x="18" y="18" width="28" height="8" rx="2.5" fill="#4aa3ff" />
    <rect x="29" y="26" width="6" height="9" fill="#4aa3ff" />
    <rect x="16" y="38" width="32" height="12" rx="3" fill="#fff" />
    <text x="32" y="48" textAnchor="middle" fontFamily="Poppins, sans-serif"
          fontWeight="800" fontSize="11" fill="#0b2a5b">3D</text>
  </svg>
);

/** Slot key → fallback. Anything not listed simply renders nothing. */
const FALLBACKS = {
  calendar: Calendar,
  clock: Clock,
  pin: Pin,
  phone: Phone,
  games: Gamepad,
  prizes: () => <Gift bow="#fff" body="#fff" ink="#3f9129" />,
  chess: Chess,
  giveaways: () => <Gift bow="#fff" body="#fff" ink="#dd6a0c" />,
  more: Bag,
  coding: Laptop,
  minecraft: Cube,
  roblox: Blocks,
  printing: Printer,
};

export default FALLBACKS;
