FROM node:alpine


EXPOSE 3000
ENV PORT 3000

RUN apk add --no-cache git

RUN npm i -g pm2 --quiet

ADD package.json /tmp/package.json
RUN cd /tmp && npm install --quiet && mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app

ADD . /opt/app

RUN npm run build

# Clear deps and caches
RUN apk --purge del git && rm -rf /var/cache/apk/*

CMD pm2 start --no-daemon server
