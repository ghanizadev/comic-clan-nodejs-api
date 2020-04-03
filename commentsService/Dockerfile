FROM node:12.6.1-alpine

COPY . /

RUN npm install
RUN npm run build

CMD npm run start

EXPOSE 3002