import { Prisma, Image } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { arg, booleanArg } from "nexus/dist"
import checkAccess from "../../accessControl"
import KafkaProducer, { ProducerMessage } from "../../services/kafkaProducer"
import {
  uploadImage,
  deleteImage as deleteStorageImage,
} from "../../services/google-cloud"

const sharp = require("sharp")

const getImageBuffer = image => {
  const base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, "")

  return new Buffer(base64EncodedImageString, "base64")
}

const readFS = (stream: NodeJS.ReadStream): Promise<Buffer> => {
  let chunkList: any[] | Uint8Array[] = []

  return new Promise((resolve, reject) =>
    stream
      .on("data", data => chunkList.push(data))
      .on("error", err => reject(err))
      .on("end", () => resolve(Buffer.concat(chunkList))),
  )
}

const addImage = async (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addImage", {
    type: "Image",
    args: {
      file: arg({ type: "Upload", required: true }),
      base64: booleanArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)

      const { base64 } = args
      const {
        createReadStream,
        mimetype,
        filename,
      }: {
        createReadStream: Function
        mimetype: string
        filename: string
      } = await args.file

      const image: Buffer = await readFS(createReadStream())
      const filenameWithoutExtension = /(.+?)(\.[^.]*$|$)$/.exec(filename)[1]

      const uncompressedImage: Buffer = await sharp(image)
        .jpeg()
        .toBuffer()

      const compressedImage: Buffer = await sharp(image)
        .resize({ height: 250 })
        .webp()
        .toBuffer()

      let original = await uploadImage({
        imageBuffer: image,
        mimeType: mimetype,
        name: filenameWithoutExtension,
        directory: `original`,
        base64,
      })

      const uncompressed = await uploadImage({
        imageBuffer: uncompressedImage,
        mimeType: "image/jpeg",
        name: filenameWithoutExtension,
        directory: `jpeg`,
        base64,
      })

      const compressed = await uploadImage({
        imageBuffer: compressedImage,
        mimeType: "image/webp",
        name: filenameWithoutExtension,
        directory: `webp`,
        base64,
      })

      const prisma: Prisma = ctx.prisma

      if (base64 && original.length > 262144) {
        // Image upload fails if the original pic is too big converted to base64.
        // Since we're only base64'ing in dev, this is not a production problem
        original = uncompressed
      }

      const newImage: Image = await prisma.createImage({
        name: filename,
        original,
        original_mimetype: mimetype,
        uncompressed,
        uncompressed_mimetype: "image/jpeg",
        compressed,
        compressed_mimetype: "image/webp",
      })

      return newImage
    },
  })
}

const deleteImage = async (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("deleteImage", {
    type: "Boolean",
    args: {
      id: arg({ type: "UUID", required: true }),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)

      const { id } = args

      const prisma: Prisma = ctx.prisma

      const image = await prisma.image({ id })

      if (!image) {
        return false
      }

      // TODO: (?) do something with return statuses
      const compressed = await deleteStorageImage(image.compressed)
      const uncompressed = await deleteStorageImage(image.uncompressed)
      const original = await deleteStorageImage(image.original)

      await prisma.deleteImage({ id })

      return true
    },
  })
}

const addImageMutations = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  addImage(t)
  deleteImage(t)
}

export default addImageMutations
