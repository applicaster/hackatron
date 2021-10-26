# # BUILDING the APP
# FROM node:10 AS builder
# WORKDIR /app
# COPY ./package.json ./
# RUN npm install
# COPY . .
# RUN npm run build


# PRODUCTION
FROM ubuntu:latest


# Installing dependencies.
RUN apt-get update -y
RUN apt install -y nodejs
RUN apt-get update -y
RUN apt install -y npm
RUN apt install -y openjdk-11-jre-headless 
RUN java -version

WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy local code to the container image.
COPY . ./

# Build the application
RUN npm run build

RUN npm install --only=production
EXPOSE 8080
CMD ["npm", "run", "start:prod"]
 

 