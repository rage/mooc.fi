import { Prisma, Image } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { arg, idArg } from "nexus/dist"
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
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)

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

      const original = await uploadImage({
        imageBuffer: image,
        mimeType: mimetype,
        name: filenameWithoutExtension,
        directory: "original",
      })
      const uncompressed = await uploadImage({
        imageBuffer: uncompressedImage,
        mimeType: "image/jpeg",
        name: filenameWithoutExtension,
        directory: "jpeg",
      })
      const compressed = await uploadImage({
        imageBuffer: compressedImage,
        mimeType: "image/webp",
        name: filenameWithoutExtension,
        directory: "webp",
      })

      const prisma: Prisma = ctx.prisma

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

      console.log("deleting?", args)

      const { id } = args

      const prisma: Prisma = ctx.prisma

      const image = await prisma.image({ id })

      if (!image) {
        return false
      }

      console.log("hmmm?", image)

      const compressed = await deleteStorageImage(image.compressed)
      const uncompressed = await deleteStorageImage(image.uncompressed)
      const original = await deleteStorageImage(image.original)

      console.log(compressed, uncompressed, original)

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
