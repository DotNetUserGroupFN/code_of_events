FROM mhart/alpine-node:6.2.0

ADD . /app

RUN cd /app && \
    npm install --production && \
    node_modules/.bin/browserify client/app.js > client/build.js

CMD [ "node", "/app/app.js" ]
