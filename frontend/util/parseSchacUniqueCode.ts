export interface PUC {
  type: string
  organizationOrCountry: string
  identifier: string
}

export default function parseSchacPersonalUniqueCode(input: string): PUC[] {
  const codes = input.split(";")

  const parse = (code: string) => {
    const elements = code.split(":")

    return {
      type: elements[4],
      organizationOrCountry: elements[5],
      identifier: elements[6],
    }
  }

  return codes.map(parse)
}
