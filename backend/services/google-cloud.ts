import { Storage } from "@google-cloud/storage"
import * as shortid from "shortid"
import * as mimeTypes from "mimetypes"

const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_STORAGE_PROJECT,
  keyFilename: process.env.GOOGLE_CLOUD_STORAGE_KEYFILE,
})

const bucket = storage.bucket(bucketName)

export const uploadImage = async ({
  imageBuffer,
  mimeType,
  name = "",
  directory = "",
}: {
  imageBuffer: Buffer
  mimeType: string
  name?: string
  directory?: string
}): Promise<string> => {
  const filename = `${directory ? directory + "/" : ""}${shortid.generate()}${
    name && name !== "" ? "-" + name : ""
  }.${mimeTypes.detectExtension(mimeType)}`
  const file = bucket.file(filename)
  const outputFilename = `https://storage.googleapis.com/${bucketName}/${filename}`

  return new Promise((resolve, reject) => {
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

        resolve(outputFilename)
      },
    )
  })
}

export const deleteImage = async (filename: string): Promise<boolean> => {
  if (!filename || filename === "") {
    return Promise.resolve(false)
  }

  const file = bucket.file(
    filename.replace(`https://storage.googleapis.com/${bucketName}/`, ""),
  )

  return file
    .delete()
    .then(() => true)
    .catch(err => (console.error("image delete error", err), false))
}
