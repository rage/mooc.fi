import { isAdmin } from "../accessControl"
import { Context } from "../context"
import {
  deleteImage as deleteStorageImage,
  uploadImage as uploadStorageImage,
} from "../services/google-cloud"
import { arg, booleanArg, extendType, idArg, nonNull, objectType } from "nexus"

const sharp = require("sharp")

export const Image = objectType({
  name: "Image",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.compressed()
    t.model.compressed_mimetype()
    t.model.default()
    t.model.encoding()
    t.model.name()
    t.model.original()
    t.model.original_mimetype()
    t.model.uncompressed()
    t.model.uncompressed_mimetype()
    t.model.courses()
  },
})

export const ImageMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addImage", {
      type: "Image",
      args: {
        file: nonNull(arg({ type: "Upload" })),
        base64: booleanArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx: Context) => {
        const { file, base64 } = args

        return uploadImage({ ctx, file, base64: base64 ?? false })
      },
    })

    t.field("deleteImage", {
      type: "Boolean",
      args: {
        id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { id }, ctx: Context) => {
        return deleteImage({ ctx, id })
      },
    })
  },
})

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
  ctx: Context
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

  const newImage = await ctx.prisma.image.create({
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
  ctx: Context
  id: string
}): Promise<boolean> => {
  const image = await ctx.prisma.image.findUnique({ where: { id } })

  if (!image) {
    return false
  }

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
  await ctx.prisma.image.delete({ where: { id } })

  return true
}
