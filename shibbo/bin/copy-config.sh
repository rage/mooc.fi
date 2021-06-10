#!/bin/bash
set -eo pipefail

CURRENT_DIR="$(dirname "$0")"

if [[ "$NODE_ENV" == "production" ]]; then
  echo "Copying configuration..."
  cp $CURRENT_DIR/../shibboleth/shibboleth2.xml /etc/shibboleth/shibboleth2.xml
  cp $CURRENT_DIR/../shibboleth/shib.conf /etc/httpd/conf.d/shib.conf
  cp $CURRENT_DIR/../shibboleth/certs/* /etc/pki/tls/certs
  cp $CURRENT_DIR/../shibboleth/sign-login.helsinki.fi.crt /etc/shibboleth/sign-login.helsinki.fi.crt
  cp $CURRENT_DIR/../shibboleth/httpd.conf /etc/httpd/conf/httpd.conf
  cp $CURRENT_DIR/../shibboleth/ssl.conf /etc/httpd/conf.d/ssl.conf
  cp $CURRENT_DIR/../shibboleth/attribute-map.xml /etc/shibboleth/attribute-map.xml
  echo "Configuration copied!"
fi