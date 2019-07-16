import { Prisma, Image } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, booleanArg, arg, idArg } from "nexus/dist"
import checkAccess from "../../accessControl"
import KafkaProducer, { ProducerMessage } from "../../services/kafkaProducer"
import { uploadImage, uploadBase64Image } from "../../services/google-cloud"

const sharp = require("sharp")

const getImageBuffer = image => {
  const base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, "")

  return new Buffer(base64EncodedImageString, "base64")
}

const readFS = (stream: NodeJS.ReadStream) => {
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

      const { createReadStream, mimetype, filename } = await args.file

      const image = await readFS(createReadStream())
      const filenameWithoutExtension = /(.+?)(\.[^.]*$|$)$/.exec(filename)[1]

      const uncompressedImage = await sharp(image)
        .jpeg()
        .toBuffer()

      const compressedImage = await sharp(image)
        .resize({ height: 250 })
        .webp()
        .toBuffer()

      const uncompressed = await uploadImage(
        uncompressedImage,
        "image/jpeg",
        filenameWithoutExtension,
      )
      const compressed = await uploadImage(
        compressedImage,
        "image/webp",
        filenameWithoutExtension,
      )

      const prisma: Prisma = ctx.prisma

      const newImage: Image = await prisma.createImage({
        name: filename,
        uncompressed,
        uncompressed_mimetype: "image/jpeg",
        compressed,
        compressed_mimetype: "image/webp",
      })

      return newImage
    },
  })
}

const addImageMutations = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  addImage(t)
}

export default addImageMutations
