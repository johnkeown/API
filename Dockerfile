# syntax=docker/dockerfile:1

FROM node:20.18.2
WORKDIR /app
COPY . /app
RUN npm install
CMD npm run start:dev
EXPOSE 8000