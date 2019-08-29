const imagemin = require("imagemin")
const webp = require("imagemin-webp")
const outputFolder = "./static/images"
const PNG = "./static/images/*.png"
const JPEG = "./static/images/*.jpg"

imagemin([PNG], outputFolder, {
  plugins: [
    webp({
      lossless: true,
    }),
  ],
})

imagemin([JPEG], outputFolder, {
  plugins: [
    webp({
      quality: 65, // Quality setting from 0 to 100
    }),
  ],
})
