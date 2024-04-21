FROM node:latest

# Create app directory
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
ENV TZ=Africa/Tunis
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
# Bundle app source
COPY . .
EXPOSE 3500
CMD [ "node", "index.js" ]
