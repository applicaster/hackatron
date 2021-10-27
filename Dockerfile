# # BUILDING the APP
# FROM node:10 AS builder
# WORKDIR /app
# COPY ./package.json ./
# RUN npm install
# COPY . .
# RUN npm run build


# PRODUCTION
FROM python:3.9-buster

# # Installing dependencies.
# RUN apt-get update -y
# RUN apt install -y nodejs
# RUN apt-get update -y
# RUN apt install -y npm
# RUN apt install -y openjdk-11-jre-headless 
# RUN java -version

WORKDIR /app

ENV PORT=8000
# Install dependencies
COPY . ./requirements.txt
RUN pip install -r ./requirements.txt

# Copy local code to the container image.
COPY . ./

# Build the application
RUN npm run build

RUN npm install --only=production
EXPOSE 8000
CMD ["uvicorn", "main:app", "--reload"]
 

 