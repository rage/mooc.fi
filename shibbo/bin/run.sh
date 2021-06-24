#!/bin/bash

CURRENT_DIR="$(dirname "$0")"
if [ ! -n "$CIRCLE_SHA1" ]; then
  source "$CURRENT_DIR/copy-config.sh"
fi

/usr/local/bin/httpd-shibd-foreground
# supervisord -n
