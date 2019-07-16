import { Storage } from "@google-cloud/storage"
import { createReadStream } from "fs"
import * as shortid from "shortid"
import * as mimeTypes from "mimetypes"

const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_STORAGE_PROJECT,
  keyFilename: process.env.GOOGLE_CLOUD_STORAGE_KEYFILE,
})

const bucket = storage.bucket(bucketName)

export const uploadImage = async (
  imageBuffer,
  mimeType,
  name,
): Promise<any> => {
  const filename = `${shortid.generate()}${
    name ? "-" + name : ""
  }.${mimeTypes.detectExtension(mimeType)}`

  const file = bucket.file(filename)

  return new Promise((resolve, reject) => {
    console.time("file save")
    file.save(
      imageBuffer,
      {
        // metadata: { contentType: mimeType },
        public: true,
        validation: "md5",
      },
      error => {
        if (error) {
          reject(error)
        }

        resolve(`https://storage.googleapis.com/${bucketName}/${filename}`)
      },
    )
    console.timeEnd("file save")
  })
}
