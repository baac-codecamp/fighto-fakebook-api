FROM node:12

RUN mkdir - p /user/src/app
WORKDIR /usr/src/app

#Entry Point
COPY package.json ./
RUN npm install
COPY ./ ./ 

EXPOSE 3000

CMD ["pm2-runtime app.js -i max"]