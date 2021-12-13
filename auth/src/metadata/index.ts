import axios from "axios"
import fs from "fs"
import { SamlConfig } from "passport-saml"
import { MetadataReader, toPassportConfig } from "passport-saml-metadata"
import { FileKeyInfo, SignedXml, xpath } from "xml-crypto"

import { DOMParser } from "@xmldom/xmldom"

import { MOOCFI_PRIVATE_KEY, SP_URL } from "../config"
import { CERTS_DIR, METADATA_DIR, MetadataConfig } from "./config"

type IpConfig = Pick<
  SamlConfig,
  "entryPoint" | "logoutUrl" | "cert" | "identifierFormat"
>

type SpConfig = Omit<
  SamlConfig,
  "entryPoint" | "logoutUrl" | "cert" | "identifierFormat"
>

const isError = (err: unknown): err is Error => err instanceof Error
const getErrorMessage = (err: unknown) => (isError(err) ? err.message : err)

const ensureDirectories = () => {
  for (const dir of [METADATA_DIR, CERTS_DIR]) {
    console.log(`check if directory ${dir} exists`)
    if (!fs.existsSync(dir)) {
      console.log(`create directory ${dir}`)
      fs.mkdirSync(dir, { recursive: true })
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
      `could not load certificate for provider ${name}: ${getErrorMessage(
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
      `error getting key info provider: ${getErrorMessage(error)}`,
    )
  }
  sig.loadSignature(signature as string)
  if (!sig.checkSignature(metadata)) {
    throw new Error(sig.validationErrors.join("\n"))
  }
}

async function getAndCheckMetadata(config: MetadataConfig) {
  const { metadataURL, metadataFile, name } = config

  let xml: string

  try {
    xml = fs.readFileSync(metadataFile).toString()
    if (!isMetadataCurrent(xml)) {
      throw new Error(`expired, will fetch new metadata for ${name}...`)
    }
    console.log("getAndCheckMetadata: got recent metadata", metadataFile)
  } catch {
    const { data } = await axios.get<string>(metadataURL)
    xml = data
    if (!xml) {
      throw new Error(`could not fetch metadata for ${name}`)
    }
    console.log("getAndCheckMetadata: got data from", metadataURL)
    try {
      await validateMetadata(config, xml)
      fs.writeFileSync(metadataFile, xml) //new XMLSerializer().serializeToString(meta))
      console.log(`getAndCheckMetadata: wrote ${name} metadata`)
    } catch (error: unknown) {
      throw new Error(
        `error validating or writing metadata: ${getErrorMessage(error)}`,
      )
    }
  }

  return xml
}

export async function getPassportConfig(
  config: MetadataConfig,
): Promise<SamlConfig> {
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
