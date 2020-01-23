FROM node:13.6.0-stretch
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm install pm2@latest -g
CMD ["pm2-runtime", "index.js"]