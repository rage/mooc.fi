import axios from "axios"
import fs from "fs"
import { SamlConfig } from "passport-saml"
import { MetadataReader, toPassportConfig } from "passport-saml-metadata"
import { FileKeyInfo, SignedXml, xpath } from "xml-crypto"

import { DOMParser } from "@xmldom/xmldom"

import { CERTS_DIR, METADATA_DIR, MOOCFI_PRIVATE_KEY, SP_URL } from "../config"
import { createLogger, getErrorMessage } from "../util"

const logger = createLogger({ service: "metadata" })

type IpConfig = Pick<
  SamlConfig,
  "entryPoint" | "logoutUrl" | "cert" | "identifierFormat"
>

type SpConfig = Omit<
  SamlConfig,
  "entryPoint" | "logoutUrl" | "cert" | "identifierFormat"
>

async function getPassportConfig(config: MetadataConfig): Promise<SamlConfig> {
  try {
    ensureDirectories()

    if (!config) {
      throw new Error(`missing configuration!`)
    }

    const metadata = await getAndCheckMetadata(config)
    const reader = new MetadataReader(metadata)

    const ipConfig: IpConfig = {
      ...toPassportConfig(reader),
      identifierFormat: "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
    }

    const spConfig: SpConfig = {
      audience: SP_URL,
      issuer: SP_URL,
      decryptionPvk: MOOCFI_PRIVATE_KEY,
      privateKey: MOOCFI_PRIVATE_KEY,
      forceAuthn: true,
      signatureAlgorithm: "sha256",
      cacheProvider: undefined,

      // FIXME: would need a cache provider to wotk with MultiSamlStrategy?
      // validateInResponseTo: true,
      disableRequestedAuthnContext: true,
    }

    return {
      ...ipConfig,
      ...spConfig,
    }
  } catch (error: unknown) {
    throw new Error(`${getErrorMessage(error)}`)
  }
}

type MetadataConfig = {
  name: string
  metadataURL: string
  certURL: string
  metadataFile: string
  certFile: string
}

const getCertFilename = (filename: string) =>
  filename.match(/^.*\/(.*\.(crt|key|pem))(.*)?$/)?.[1]
const getMetadataFilename = (filename: string) =>
  filename.match(/^.*\/(.*\.xml)$/)?.[1]

const createMetadataConfig = (
  name: string,
  metadataURL: string,
  certURL: string,
): MetadataConfig => ({
  name,
  metadataURL,
  certURL,
  metadataFile: `${METADATA_DIR}/${getMetadataFilename(metadataURL)}`,
  certFile: `${CERTS_DIR}/${getCertFilename(certURL)}`,
})

const ensureDirectories = () => {
  for (const dir of [METADATA_DIR, CERTS_DIR]) {
    if (!fs.existsSync(dir)) {
      logger.info(`directory ${dir} didn't exist, creating...`)
      try {
        fs.mkdirSync(dir, { recursive: true })
      } catch (error: unknown) {
        throw new Error(
          `could not create directory ${dir}: ${getErrorMessage(error)}`,
        )
      }
    }
  }
}

const isMetadataCurrent = (metadata: string) => {
  const meta = new DOMParser().parseFromString(metadata, "text/xml")
  const validUntil = Date.parse(
    meta
      .getElementsByTagName("EntitiesDescriptor")?.[0]
      ?.getAttribute("validUntil") ?? "",
  )

  return validUntil >= Date.now()
}

async function getKeyInfoProvider(
  config: MetadataConfig,
): Promise<FileKeyInfo> {
  const { certURL, certFile, name } = config

  if (fs.existsSync(certFile)) {
    logger.info("getKeyInfoProvider: found certFile", certFile)
    return new FileKeyInfo(certFile)
  }

  try {
    const { data } = await axios.get<string>(certURL)
    logger.info("getKeyInfoProvider: got data from", certURL)
    fs.writeFileSync(certFile, data)
    logger.info("getKeyInfoProvider: wrote certfile", certFile)

    return new FileKeyInfo(certFile)
  } catch (error: unknown) {
    throw new Error(
      `getKeyInfoProvider: could not load certificate for provider ${name}: ${getErrorMessage(
        error,
      )}`,
    )
  }
}

async function validateMetadata(config: MetadataConfig, metadata: string) {
  const parsedMetadata = new DOMParser().parseFromString(metadata, "text/xml")

  const signature = xpath(
    parsedMetadata,
    "/*/*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']",
  )?.[0]
  const sig = new SignedXml()
  try {
    sig.keyInfoProvider = await getKeyInfoProvider(config)
  } catch (error: unknown) {
    throw new Error(
      `validateMetadata: error getting key info provider: ${getErrorMessage(
        error,
      )}`,
    )
  }
  sig.loadSignature(signature as string)
  if (!sig.checkSignature(metadata)) {
    throw new Error(sig.validationErrors.join("\n"))
  }
}

async function getAndCheckMetadata(config: MetadataConfig) {
  const { metadataURL, metadataFile, name } = config

  let xml: string = ""

  try {
    xml = fs.readFileSync(metadataFile).toString()

    if (!isMetadataCurrent(xml)) {
      logger.info(
        `getAndCheckMetadata: metadata for ${name} expired, fetching new...`,
      )
      const { data } = await axios.get<string>(metadataURL)
      xml = data

      if (!xml) {
        throw new Error(`could not fetch metadata for ${name}`)
      }
      logger.info(
        `getAndCheckMetadata: got metadata for ${name} from ${metadataURL}`,
      )
    }

    await validateMetadata(config, xml)
    fs.writeFileSync(metadataFile, xml)
    logger.info("getAndCheckMetadata: wrote metadata", metadataFile)
  } catch (error: any) {
    logger.error(
      `getAndCheckMetadata: error validating or writing metadata: ${getErrorMessage(
        error,
      )}`,
    )
  }

  return xml
}

export {
  CERTS_DIR,
  createMetadataConfig,
  getPassportConfig,
  METADATA_DIR,
  MetadataConfig,
}
