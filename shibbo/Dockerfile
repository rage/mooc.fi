FROM unicon/shibboleth-sp

COPY --chown=shibd . ./app

### uncomment these if building locally
# COPY shibboleth/shibboleth2.xml /etc/shibboleth/shibboleth2.xml
# COPY shibboleth/shib.conf /etc/httpd/conf.d/shib.conf
# COPY shibboleth/certs /etc/pki/tls/certs
# COPY shibboleth/sign-login.helsinki.fi.crt /etc/shibboleth/sign-login.helsinki.fi.crt
# COPY shibboleth/httpd.conf /etc/httpd/conf/httpd.conf
# COPY shibboleth/ssl.conf /etc/httpd/conf.d/ssl.conf
# COPY shibboleth/attribute-map.xml /etc/shibboleth/attribute-map.xml
# COPY shibboleth/shibd.logger /etc/shibboleth/shibd.logger

WORKDIR /app

EXPOSE 80 443

USER root

CMD ["sh", "./bin/run.sh"]

ARG GIT_COMMIT=""
LABEL GIT_COMMIT=${GIT_COMMIT}
ENV GIT_COMMIT=${GIT_COMMIT}
