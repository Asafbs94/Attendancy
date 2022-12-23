FROM node:14.15.1-slim
WORKDIR /app
COPY . .
RUN echo "NPM: " && npm -v
EXPOSE 3333
RUN npm install
RUN npm run build
USER root

ENTRYPOINT ["npm","run", "start:new"]
