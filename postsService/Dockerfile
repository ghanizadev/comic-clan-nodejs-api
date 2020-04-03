FROM node:12.16.1-alpine3.11

ENV PORT=3003

COPY . /

RUN npm install
RUN npm run build

CMD npm run start

EXPOSE 3003