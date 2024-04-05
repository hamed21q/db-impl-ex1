FROM node:latest

WORKDIR /app

COPY dns-ui .

RUN npm install

RUN npm run build

FROM nginx
COPY --from=ui-builder /app/dns-ui/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
