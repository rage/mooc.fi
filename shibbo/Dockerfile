FROM unicon/shibboleth-sp

RUN yum -y update
RUN curl -sL https://rpm.nodesource.com/setup_12.x | bash -
RUN yum -y install nodejs npm mod_ssl
RUN yum -y install epel-release
RUN yum -y update
RUN yum -y install supervisor
RUN yum clean all

RUN useradd -ms /bin/bash node 
RUN useradd -G tty -U -ms /bin/bash supervisor

COPY --chown=node . ./app
# COPY . /app

RUN mkdir -p /var/log/supervisor && chown -R supervisor:supervisor /var/log/supervisor/ 
RUN mkdir -p /var/run/supervisor && chown -R supervisor:supervisor /var/run/supervisor/

#&& chmod u=rwx,go=rx,a+s /var/log/myapplogs/
COPY supervisord.conf /etc/supervisord/conf.d/supervisord.conf

### uncomment these if building locally
# COPY shibboleth/shibboleth2.xml /etc/shibboleth/shibboleth2.xml
# COPY shibboleth/shib.conf /etc/httpd/conf.d/shib.conf
# COPY shibboleth/certs /etc/pki/tls/certs
# COPY shibboleth/sign-login.helsinki.fi.crt /etc/shibboleth/sign-login.helsinki.fi.crt
# COPY shibboleth/httpd.conf /etc/httpd/conf/httpd.conf
# COPY shibboleth/ssl.conf /etc/httpd/conf.d/ssl.conf
# COPY shibboleth/attribute-map.xml /etc/shibboleth/attribute-map.xml
# COPY shibboleth/shibd.logger /etc/shibboleth/shibd.logger
# COPY shibboleth/haka_test_metadata_signed.xml /etc/shibboleth/haka_test_metadata_signed.xml
# COPY shibboleth/haka_testi_2018_sha2.crt /etc/shibboleth/haka_testi_2018_sha2.crt

USER node

WORKDIR /app

RUN rm -rf shibboleth && rm -rf docs
RUN npm ci

ENV NODE_ENV=production

EXPOSE 80

USER root
# USER supervisor
# CMD ["supervisord", "-n"]
CMD ["sh", "./bin/run.sh"]

ARG GIT_COMMIT=""
LABEL GIT_COMMIT=${GIT_COMMIT}
ENV GIT_COMMIT=${GIT_COMMIT}
