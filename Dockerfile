FROM node:6

WORKDIR /shintech

COPY . .

RUN useradd --user-group --create-home --shell /bin/bash shintech && \
 chown -R shintech:shintech /shintech && \
 apt-get update && \
 apt-get -y install coreutils ftp && \
 apt-get -y install apt-transport-https && \
 curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
 echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
 apt-get update && \
 apt-get -y install yarn && \
 apt-get -y install python-pip python-dev build-essential && \
 pip install dumb-init

USER shintech

RUN rm -rf ./lib/ ./data/ ./node_modules/ ./env.*.js && \
 yarn config set registry https://registry.npmjs.org/ -g && \
 yarn install --force && \
 npm run build && \
 mkdir -p data/logs

CMD dumb-init npm start
