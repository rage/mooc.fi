import { NextFunction, Request, Response } from "express"
import { MultiSamlStrategy, Strategy as SamlStrategy } from "passport-saml"

import { MOOCFI_CERTIFICATE } from "../config"

export function metadataHandler(strategy: MultiSamlStrategy | SamlStrategy) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (strategy instanceof MultiSamlStrategy) {
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
    } else {
      res
        .status(200)
        .send(
          strategy.generateServiceProviderMetadata(
            MOOCFI_CERTIFICATE,
            MOOCFI_CERTIFICATE,
          ),
        )
    }
  }
}
