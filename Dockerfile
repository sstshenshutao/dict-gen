FROM node:13 AS compile-env

WORKDIR /src

COPY . /src

RUN apt-get update -y && apt-get install yarn -y

RUN yarn && yarn build

FROM nginx:latest

WORKDIR /application

COPY --from=compile-env /src/dist /application

COPY ./nginx /application/nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
