/**
 * Single source of truth for the reference image a poster was built from.
 *
 * `npm run source` rewrites THIS FILE as well as copying the image, because a
 * bundler import has to be a static string and the submitted file can be a
 * .jpg, .png or .webp. Don't hand-edit the import line — re-run the script:
 *
 *     npm run source                      # newest image in ~/Downloads
 *     npm run source -- ~/Downloads/x.jpg # a specific file
 *
 * Unlike `logo.png`, this image does NOT need an alpha channel. A photo is
 * fine. What a poster does with it is the poster's decision — see
 * `src/Utils/useSource.js`:
 *
 *   - render it as the subject (full bleed, framed, cut out, duotoned), and/or
 *   - take only its PALETTE and build the artwork by hand around those colours.
 *
 * The placeholder shipped here is a dojo photo so the repo renders something
 * real before anything has been submitted.
 */
import sourceSrc from "./Images/source.jpg";

export default sourceSrc;
