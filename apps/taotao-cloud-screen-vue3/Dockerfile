FROM node:26-alpine AS build

WORKDIR /app

COPY . /app

RUN pnpm install && pnpm run build

FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
