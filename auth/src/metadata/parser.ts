import axios from "axios"
import fs from "fs"
import { FileKeyInfo, SignedXml, xpath } from "xml-crypto"

import { DOMParser, XMLSerializer } from "@xmldom/xmldom"

const HY_METADATA_URL = ""
const HAKA_METADATA_URL = ""
const HY_METADATA_CERTIFICATE_URL = ""
const HAKA_METADATA_CERTIFICATE_URL = ""

type MetadataConfig = {
  metadataURL: string
  certURL: string
  metadataFile: string
  certFile: string
}

const metadataConfig: Record<string, MetadataConfig> = {
  hy: {
    metadataURL: HY_METADATA_URL,
    certURL: HY_METADATA_CERTIFICATE_URL,
    metadataFile: "../../metadata/hy-metadata.xml",
    certFile: "../../certs/hy-test.cert",
  },
  haka: {
    metadataURL: HAKA_METADATA_URL,
    certURL: HAKA_METADATA_CERTIFICATE_URL,
    metadataFile: "../../metadata/haka-metadata.xml",
    certFile: "../../certs/haka-test.cert",
  },
}

export async function parse(provider: string) {
  if (!metadataConfig[provider]) {
    throw new Error(`invalid provider ${provider}`)
  }

  const { metadataURL, certURL, metadataFile, certFile } = metadataConfig[
    provider
  ]

  let meta

  try {
    const xml = fs.readFileSync(metadataFile).toString()
    meta = new DOMParser().parseFromString(xml, "text/xml")
    const validUntil = Date.parse(
      meta
        .getElementsByTagName("EntitiesDescriptor")?.[0]
        .getAttribute("validUntil") ?? "",
    )
    if (validUntil < Date.now()) {
      throw new Error("expired")
    }
  } catch {
    const { data: xml } = await axios.get<string>(metadataURL)
    if (!fs.existsSync(certFile)) {
      const { data } = await axios.get<string>(certURL)
      fs.writeFileSync(certFile, data)
    }

    meta = new DOMParser().parseFromString(xml, "text/xml")
    const signature = xpath(
      meta,
      "/*/*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']",
    )?.[0]
    const sig = new SignedXml()
    sig.keyInfoProvider = new FileKeyInfo(certFile)
    sig.loadSignature(signature as string)
    if (!sig.checkSignature(xml)) {
      throw new Error(sig.validationErrors.join("\n"))
    }
    fs.writeFileSync(metadataFile, new XMLSerializer().serializeToString(meta))
    console.log(`wrote ${provider} metadata`)
  }

  return meta
}

// parse("hy")
