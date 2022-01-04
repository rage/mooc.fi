import {
  HAKA_METADATA_CERTIFICATE_URL,
  HAKA_METADATA_URL,
  HY_METADATA_CERTIFICATE_URL,
  HY_METADATA_URL,
} from "../config"

export type MetadataConfig = {
  name: string
  metadataURL: string
  certURL: string
  metadataFile: string
  certFile: string
}

export const METADATA_DIR = __dirname + "/../../metadata"
export const CERTS_DIR = __dirname + "/../../certs"

const getCertFilename = (filename: string) =>
  filename.match(/^.*\/(.*\.(crt|key|pem))(.*)?$/)?.[1]
const getMetadataFilename = (filename: string) =>
  filename.match(/^.*\/(.*\.xml)$/)?.[1]

export const createMetadataConfig = (
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

export const metadataConfig: Record<string, MetadataConfig> = {
  hy: createMetadataConfig("hy", HY_METADATA_URL, HY_METADATA_CERTIFICATE_URL),
  haka: createMetadataConfig(
    "haka",
    HAKA_METADATA_URL,
    HAKA_METADATA_CERTIFICATE_URL,
  ),
}
