FROM node:20-alpine AS builder

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM pierrezemb/gostatic AS runner

COPY --from=builder /app/dist /srv/http

CMD ["-enable-health", "-enable-logging", "-fallback", "index.html"]
