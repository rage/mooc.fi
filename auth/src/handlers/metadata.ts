import { NextFunction, Request, Response } from "express"
import { MultiSamlStrategy } from "passport-saml/lib/passport-saml"

import { MOOCFI_CERTIFICATE } from "../config"

export function metadataHandler(strategy: MultiSamlStrategy) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send(
      strategy.generateServiceProviderMetadata(
        req,
        MOOCFI_CERTIFICATE,
        MOOCFI_CERTIFICATE,
        (err, data) => {
          if (err) {
            return next()
          }

          res.set("Content-Type", "application/xml")
          res.send(data)
        },
      ),
    )
  }
}