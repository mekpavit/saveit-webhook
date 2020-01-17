FROM node:13.6.0-stretch
WORKDIR /usr/src/app
COPY . .
RUN npm install
CMD ["node", "index.js"]