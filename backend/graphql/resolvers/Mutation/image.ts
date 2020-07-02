import { arg, booleanArg, idArg } from "@nexus/schema"
import {
  uploadImage as uploadStorageImage,
  deleteImage as deleteStorageImage,
} from "../../../services/google-cloud"
import { NexusContext } from "../../../context"
import { schema } from "nexus"
import { isAdmin } from "../../../accessControl"

const sharp = require("sharp")

// FIXME: not used anywhere
/* const getImageBuffer = (image: string) => {
  const base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, "")

  return new Buffer(base64EncodedImageString, "base64")
} */

const readFS = (stream: NodeJS.ReadStream): Promise<Buffer> => {
  let chunkList: any[] | Uint8Array[] = []

  return new Promise((resolve, reject) =>
    stream
      .on("data", (data) => chunkList.push(data))
      .on("error", (err) => reject(err))
      .on("end", () => resolve(Buffer.concat(chunkList))),
  )
}

export const uploadImage = async ({
  ctx,
  file,
  base64 = false,
}: {
  ctx: NexusContext
  file: any
  base64: boolean
}) => {
  const {
    createReadStream,
    mimetype,
    filename,
  }: {
    createReadStream: Function
    mimetype: string
    filename: string
  } = await file

  const image: Buffer = await readFS(createReadStream())
  const filenameWithoutExtension = /(.+?)(\.[^.]*$|$)$/.exec(filename)?.[1]

  const uncompressedImage: Buffer = await sharp(image).jpeg().toBuffer()

  const compressedImage: Buffer = await sharp(image)
    .resize({ height: 250 })
    .webp()
    .toBuffer()

  let original = await uploadStorageImage({
    imageBuffer: image,
    mimeType: mimetype,
    name: filenameWithoutExtension,
    directory: `original`,
    base64,
  })
  let originalMimetype = mimetype

  const uncompressed = await uploadStorageImage({
    imageBuffer: uncompressedImage,
    mimeType: "image/jpeg",
    name: filenameWithoutExtension,
    directory: `jpeg`,
    base64,
  })

  const compressed = await uploadStorageImage({
    imageBuffer: compressedImage,
    mimeType: "image/webp",
    name: filenameWithoutExtension,
    directory: `webp`,
    base64,
  })

  if (base64 && original.length > 262144) {
    // Image upload fails if the original pic is too big converted to base64.
    // Since we're only base64'ing in dev, this is not a production problem
    original = uncompressed
    originalMimetype = "image/jpeg"
  }

  const newImage = await ctx.db.image.create({
    data: {
      name: filename,
      original,
      original_mimetype: originalMimetype,
      uncompressed,
      uncompressed_mimetype: "image/jpeg",
      compressed,
      compressed_mimetype: "image/webp",
    },
  })

  return newImage
}

export const deleteImage = async ({
  ctx,
  id,
}: {
  ctx: NexusContext
  id: string
}): Promise<boolean> => {
  const image = await ctx.db.image.findOne({ where: { id } })

  if (!image) {
    return false
  }

  // TODO: (?) do something with return statuses
  const compressed = image.compressed
    ? await deleteStorageImage(image.compressed)
    : false
  const uncompressed = await deleteStorageImage(image.uncompressed)
  const original = await deleteStorageImage(image.original)

  if (!compressed || !uncompressed || !original) {
    console.warn(
      `There was some problem with image deletion. Statuses: compressed ${compressed} uncompressed ${uncompressed} original ${original}`,
    )
  }
  await ctx.db.image.delete({ where: { id } })

  return true
}

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addImage", {
      type: "Image",
      args: {
        file: arg({ type: "Upload", required: true }),
        base64: booleanArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx: NexusContext) => {
        const { file, base64 } = args

        return uploadImage({ ctx, file, base64: base64 ?? false })
      },
    })

    t.field("deleteImage", {
      type: "Boolean",
      args: {
        id: idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: async (_, { id }, ctx: NexusContext) => {
        return deleteImage({ ctx, id })
      },
    })
  },
})
