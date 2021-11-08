#!/bin/bash

kubectl create secret generic shibboleth-configs \
  --from-file=attribute-map.xml \
  --from-file=httpd.conf \
  --from-file=shib.conf \
  --from-file=shibboleth2.xml \
  --from-file=sign-hy-test-metadata.xml \
  --from-file=sign-login.helsinki.fi.crt \
  --from-file=ssl.conf \
  --from-file=./certs/mooc.fi.key \
  --from-file=./certs/mooc.fi.crt \
  --from-file=shibd.logger \
  --from-file=haka_test_metadata_signed.xml \
  --from-file=haka_testi_2018_sha2.crt

