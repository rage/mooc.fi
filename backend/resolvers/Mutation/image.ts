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

      const compressedImage = await sharp(image)
        .webp()
        .toBuffer()

      const uncompressed = await uploadImage(image, mimetype, filename)
      const compressed = await uploadImage(
        compressedImage,
        "image/webp",
        filename,
      )

      const prisma: Prisma = ctx.prisma

      const newImage: Image = await prisma.createImage({
        name: filename,
        uncompressed,
        uncompressed_mimetype: mimetype,
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
