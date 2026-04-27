FROM node:18-alpine
LABEL authors="ngoupaye"

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# Comment the line below if you want to run the dev mode
RUN npm run build

EXPOSE 9000

CMD [ "npm", "run", "preview" ]