import axios from "axios"
import fs from "fs"
import { MetadataReader, toPassportConfig } from "passport-saml-metadata"
import { FileKeyInfo, SignedXml, xpath } from "xml-crypto"

import { DOMParser } from "@xmldom/xmldom"

import {
  HAKA_METADATA_CERTIFICATE_URL,
  HAKA_METADATA_URL,
  HY_METADATA_CERTIFICATE_URL,
  HY_METADATA_URL,
  MOOCFI_PRIVATE_KEY,
  SP_URL,
} from "../config"

const METADATA_DIR = __dirname + "/../../metadata"
const CERTS_DIR = __dirname + "/../../certs"

type MetadataConfig = {
  metadataURL: string
  certURL: string
  metadataFile: string
  certFile: string
}

const isError = (err: unknown): err is Error => err instanceof Error
const getErrorMessage = (err: unknown) => (isError(err) ? err.message : err)
const getCertFilename = (filename: string) =>
  filename.match(/^.*\/(.*\.(crt|key|pem))(.*)?$/)?.[1]
const getMetadataFilename = (filename: string) =>
  filename.match(/^.*\/(.*\.xml)$/)?.[1]

const ensureDirectories = () => {
  for (const dir of [METADATA_DIR, CERTS_DIR]) {
    console.log(`check if directory ${dir} exists`)
    if (!fs.existsSync(dir)) {
      console.log(`create directory ${dir}`)
      fs.mkdirSync(dir, { recursive: true })
    }
  }
}

const createMetadataConfig = (metadataURL: string, certURL: string) => ({
  metadataURL,
  certURL,
  metadataFile: `${METADATA_DIR}/${getMetadataFilename(metadataURL)}`,
  certFile: `${CERTS_DIR}/${getCertFilename(certURL)}`,
})
const metadataConfig: Record<string, MetadataConfig> = {
  hy: createMetadataConfig(HY_METADATA_URL, HY_METADATA_CERTIFICATE_URL),
  haka: createMetadataConfig(HAKA_METADATA_URL, HAKA_METADATA_CERTIFICATE_URL),
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

async function getKeyInfoProvider(provider: string): Promise<FileKeyInfo> {
  const { certURL, certFile } = metadataConfig[provider]

  if (fs.existsSync(certFile)) {
    console.log("getKeyInfoProvider: found certFile", certFile)
    return new FileKeyInfo(certFile)
  }

  try {
    const { data } = await axios.get<string>(certURL)
    console.log("getKeyInfoProvider: got data from", certURL)
    fs.writeFileSync(certFile, data)
    console.log("getKeyInfoProvider: wrote certfile", certFile)
    return new FileKeyInfo(certFile)
  } catch (error: unknown) {
    throw new Error(
      `could not load certificate for provider ${provider}: ${getErrorMessage(
        error,
      )}`,
    )
  }
}

async function validateMetadata(provider: string, metadata: string) {
  const parsedMetadata = new DOMParser().parseFromString(metadata, "text/xml")

  const signature = xpath(
    parsedMetadata,
    "/*/*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']",
  )?.[0]
  const sig = new SignedXml()
  try {
    sig.keyInfoProvider = await getKeyInfoProvider(provider)
  } catch (error: unknown) {
    throw new Error(
      `error getting key info provider: ${getErrorMessage(error)}`,
    )
  }
  sig.loadSignature(signature as string)
  if (!sig.checkSignature(metadata)) {
    throw new Error(sig.validationErrors.join("\n"))
  }
}

async function getAndCheckMetadata(provider: string) {
  if (!metadataConfig[provider]) {
    throw new Error(`invalid provider ${provider}`)
  }

  const { metadataURL, metadataFile } = metadataConfig[provider]

  let xml: string

  try {
    xml = fs.readFileSync(metadataFile).toString()
    if (!isMetadataCurrent(xml)) {
      throw new Error(`expired, will fetch new metadata for ${provider}...`)
    }
    console.log("getAndCheckMetadata: got recent metadata", metadataFile)
  } catch {
    const { data } = await axios.get<string>(metadataURL)
    xml = data
    if (!xml) {
      throw new Error(`could not fetch metadata for ${provider}`)
    }
    console.log("getAndCheckMetadata: got data from", metadataURL)
    try {
      await validateMetadata(provider, xml)
      fs.writeFileSync(metadataFile, xml) //new XMLSerializer().serializeToString(meta))
      console.log(`getAndCheckMetadata: wrote ${provider} metadata`)
    } catch (error: unknown) {
      throw new Error(
        `error validating or writing metadata: ${getErrorMessage(error)}`,
      )
    }
  }

  return xml
}

export async function getPassportConfig(provider: string) {
  try {
    ensureDirectories()

    const metadata = await getAndCheckMetadata(provider)
    const reader = new MetadataReader(metadata)
    const ipConfig = toPassportConfig(reader)

    return {
      ...ipConfig,
      issuer: SP_URL,
      privateKey: MOOCFI_PRIVATE_KEY,
      validateInResponseTo: false,
      disableRequestedAuthnContext: true,
    }
  } catch (error: unknown) {
    throw new Error(`${getErrorMessage(error)}`)
  }
}
// parse("hy")
