import { Storage } from "@google-cloud/storage"
import * as shortid from "shortid"
import * as mimeTypes from "mimetypes"

const isProduction = process.env.NODE_ENV === "production"
const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET

const storage = isProduction
  ? new Storage({
      projectId: process.env.GOOGLE_CLOUD_STORAGE_PROJECT,
      keyFilename: process.env.GOOGLE_CLOUD_STORAGE_KEYFILE,
    })
  : {
      bucket: () => ({
        file: () => ({
          save: (
            buffer: any,
            options: any,
            cb: (error?: string) => void,
          ): any => cb(),
          delete: (): any => Promise.resolve(true),
        }),
      }),
    }
// FIXME: doesn't actually upload in dev even with base64 set to false unless isproduction is true

const bucket = storage.bucket(bucketName)

export const uploadImage = async ({
  imageBuffer,
  mimeType,
  name = "",
  directory = "",
  base64 = false,
}: {
  imageBuffer: Buffer
  mimeType: string
  name?: string
  directory?: string
  base64?: boolean
}): Promise<string> => {
  const filename = `${directory ? directory + "/" : ""}${shortid.generate()}${
    name && name !== "" ? "-" + name : ""
  }.${mimeTypes.detectExtension(mimeType)}`

  if (base64) {
    const base64 = `data:${mimeType};base64,` + imageBuffer.toString("base64")

    return Promise.resolve(base64)
  }

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

  if (~filename.indexOf("base64")) {
    return Promise.resolve(true)
  }

  const file = bucket.file(
    filename.replace(`https://storage.googleapis.com/${bucketName}/`, ""),
  )

  return file
    .delete()
    .then(() => true)
    .catch(err => (console.error("image delete error", err), false))
}
