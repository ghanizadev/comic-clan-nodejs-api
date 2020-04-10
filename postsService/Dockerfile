FROM node:12.16.1-alpine3.11

ARG ENV
ENV NODE_ENV=$ENV

# ENV NODE_ENV=production

COPY package.json .
RUN npm install
COPY . /
RUN npm run build

CMD npm run start