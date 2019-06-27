const imagemin = require("imagemin")
const webp = require("imagemin-webp")
const outputFolder = "./static/images/courseimages"
const PNG = "./static/images/courseimages/*.png"
const JPEG = "./static/images/courseimages/*.jpg"

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
