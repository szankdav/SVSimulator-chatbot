FROM node:22.13.0-alpine
WORKDIR /discord-chatbot
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "npm", "run", "start" ]