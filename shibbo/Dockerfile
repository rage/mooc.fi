FROM unicon/shibboleth-sp

RUN yum -y update
RUN curl -sL https://rpm.nodesource.com/setup_12.x | bash -
RUN yum -y update
RUN yum -y install nodejs npm mod_ssl
# RUN useradd -ms /bin/bash node
# COPY --chown=node . ./app
COPY . /app

# COPY shibboleth/shibboleth2.xml /etc/shibboleth/shibboleth2.xml
# COPY shibboleth/shib.conf /etc/httpd/conf.d/shib.conf
# COPY shibboleth/certs /etc/pki/tls/certs
# COPY shibboleth/sign-login.helsinki.fi.crt /etc/shibboleth/sign-login.helsinki.fi.crt
# COPY shibboleth/httpd.conf /etc/httpd/conf/httpd.conf
# COPY shibboleth/ssl.conf /etc/httpd/conf.d/ssl.conf
# COPY shibboleth/attribute-map.xml /etc/shibboleth/attribute-map.xml

RUN node -v
RUN npm -v
# USER node

WORKDIR /app

RUN rm -rf shibboleth && rm -rf docs
RUN npm ci

ENV NODE_ENV=production

EXPOSE 80 443

CMD ["sh", "./bin/run.sh"]

ARG GIT_COMMIT=""
LABEL GIT_COMMIT=${GIT_COMMIT}
ENV GIT_COMMIT=${GIT_COMMIT}
