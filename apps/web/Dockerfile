FROM oven/bun:alpine
WORKDIR /usr/src

ENV NODE_ENV=production

COPY package.json .
COPY apps/web/package.json apps/web/package.json
COPY shared/logic shared/logic
RUN bun install --production

# run the app
ADD . ./

WORKDIR /usr/src/apps/web

RUN bun run build

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "start" ]
