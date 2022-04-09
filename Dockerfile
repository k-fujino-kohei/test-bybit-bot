FROM node:16-alpine

COPY ./package.json package.json
RUN yarn

COPY ./ /