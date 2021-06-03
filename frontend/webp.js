import imagemin from "imagemin"
import webp from "imagemin-webp"
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
