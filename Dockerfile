FROM node:20
WORKDIR /src/
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY ./ ./
RUN yarn build
