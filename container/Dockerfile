from node:18-bullseye

run npm install -g npm@9.6.3

RUN git clone https://github.com/orby-tech/brainbuster-map.git

RUN cd brainbuster-map && git pull

RUN cd brainbuster-map/backend && npm install && npm run build

RUN cd brainbuster-map/frontend && npm install && npm run build

CMD cd brainbuster-map/backend && node dist/backend/src/main.js 