import { Roboto } from "@next/font/google"
import LocalFont from "@next/font/local"

// TODO/FIXME
// These css variables don't work, find a way to make them or just use the font css
// in the few places these are actually used
export const roboto = Roboto({
  subsets: ["latin", "latin-ext"],
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["italic", "normal"],
  variable: "--roboto-font",
})

// TODO/FIXME
// @next/font/google seems to be buggy and this will just crash the program if axes is set.
// When it's eventually fixed, we can import the variable width (75...100) and use the 
// 75 as the equivalent of the current condensed.
/*export const openSansCondensed = Open_Sans({
  subsets: ["latin"],
  // weight: "variable", // ["300", "700"], // "variable", // ["300", "700"],
  style: ["italic", "normal"],
  axes: ["wdth"],
  variable: "--open-sans-condensed-font"
})*/

export const openSansCondensed = LocalFont({
  src: [
    {
      path: "../static/fonts/open-sans-condensed-v14-latin-300.ttf",
      style: "normal",
      weight: "300",
    },
    {
      path: "../static/fonts/open-sans-condensed-v14-latin-300italic.ttf",
      style: "italic",
      weight: "300",
    },
    {
      path: "../static/fonts/open-sans-condensed-v14-latin-700.ttf",
      style: "normal",
      weight: "700",
    },
  ],
  variable: "--open-sans-condensed-font",
})
