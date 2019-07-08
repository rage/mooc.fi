import { Storage } from "@google-cloud/storage"
import { createReadStream } from "fs"
import * as shortid from "shortid"
import * as mimeTypes from "mimetypes"

const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_STORAGE_PROJECT,
  keyFilename: process.env.GOOGLE_CLOUD_STORAGE_KEYFILE
})

const bucket = storage.bucket(bucketName)

export const uploadBase64Image = async (image, name = ''): Promise<any> => {
  const mimeType = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1]
  const filename = `${shortid.generate()}${name ? '-' + name : ''}.${mimeTypes.detectExtension(mimeType)}` 
  const base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, '')
  const imageBuffer = new Buffer(base64EncodedImageString, 'base64')
  const file = bucket.file(filename)

  return new Promise((resolve, reject) => {
    file.save(imageBuffer, {
      metadata: { contentType: mimeType },
      public: true,
      validation: "md5"
    }, (error) => {
      if (error) {
        reject(error)
      }

      resolve(`https://storage.googleapis.com/${bucketName}/${filename}`)
    })
  })
}
