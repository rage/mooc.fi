import { Storage } from "@google-cloud/storage"
import * as mime from "mime-types"
import * as shortid from "shortid"

import {
  GOOGLE_CLOUD_STORAGE_BUCKET,
  GOOGLE_CLOUD_STORAGE_KEYFILE,
  GOOGLE_CLOUD_STORAGE_PROJECT,
  isProduction,
  NEXUS_REFLECTION,
} from "../config"

if (!GOOGLE_CLOUD_STORAGE_BUCKET && isProduction && !NEXUS_REFLECTION) {
  console.error("no bucket name defined in GOOGLE_CLOUD_STORAGE_BUCKET")
  process.exit(1)
}

const storage =
  isProduction && !NEXUS_REFLECTION
    ? new Storage({
        projectId: GOOGLE_CLOUD_STORAGE_PROJECT,
        keyFilename: GOOGLE_CLOUD_STORAGE_KEYFILE,
      })
    : {
        bucket: () => ({
          file: () => ({
            save: (
              _: any, // buffer
              __: any, // options
              cb: (error?: string) => void,
            ): any => cb(),
            delete: (): any => Promise.resolve(true),
          }),
        }),
      }
// FIXME: doesn't actually upload in dev even with base64 set to false unless isproduction is true

const bucket = storage.bucket(GOOGLE_CLOUD_STORAGE_BUCKET ?? "") // this shouldn't ever happen in production

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
  }.${mime.extension(mimeType)}`

  if (base64) {
    const base64 = `data:${mimeType};base64,` + imageBuffer.toString("base64")

    return Promise.resolve(base64)
  }

  const file = bucket.file(filename)

  return new Promise((resolve, reject) => {
    file.save(
      imageBuffer,
      {
        metadata: { cacheControl: "public, max-age=2628000" },
        // can't set this with ACL disabled; images will (hopefully) be public by default
        // public: true,
        validation: "md5",
      },
      (error: any) => {
        if (error) {
          reject(error)
        }

        resolve(filename)
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

  const file = bucket.file(filename)

  return file
    .delete()
    .then(() => true)
    .catch((err: any) => (console.error("image delete error", err), false))
}
