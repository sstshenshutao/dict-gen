FROM node:13 AS compile-env

WORKDIR /src

COPY . /src

RUN apt-get update -y && apt-get install yarn -y

RUN yarn && yarn build

FROM nginx:latest

WORKDIR /application

RUN mkdir -p /etc/nginx/logs && mkdir -p /etc/nginx/pid

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=compile-env /src/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
