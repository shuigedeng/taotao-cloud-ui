FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY apps/taotao-cloud-admin-react/docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
