FROM node:latest as ui-builder
WORKDIR /app
COPY dns-ui .
RUN npm install
RUN npm run build

FROM nginx
COPY --from=ui-builder /app/dns-ui/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]

