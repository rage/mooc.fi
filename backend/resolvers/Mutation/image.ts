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

const addImage = async (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addImage", {
    type: "Image",
    args: {
      file: arg({ type: "Upload", required: true }),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)

      const { file } = args

      console.log(args)

      // Upload scalar should expose these - now we only get path?
      const { createReadStream, mimetype, filename } = await args.file.file

      console.log("got file", file)
      console.log(filename, mimetype)

      const image = getImageBuffer(file.blob)

      const compressedImage = await sharp(image)
        .webp()
        .toBuffer()

      const uncompressed = await uploadImage(image, file.mimetype, file.path)
      const compressed = await uploadImage(
        compressedImage,
        "image/webp",
        file.path,
      )

      const prisma: Prisma = ctx.prisma

      const newImage: Image = await prisma.createImage({
        name: file.path,
        uncompressed,
        uncompressed_mimetype: file.blob.match(
          /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/,
        )[1],
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
