FROM node:latest

WORKDIR /app

COPY dns-ui .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
