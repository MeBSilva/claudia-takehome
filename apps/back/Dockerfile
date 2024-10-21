FROM oven/bun:alpine
WORKDIR /usr/src

ENV NODE_ENV=production

COPY package.json .
COPY apps/back/package.json apps/back/package.json
COPY shared/logic shared/logic
RUN bun install --production

COPY apps/back/index.ts apps/back/index.ts

# run the app
WORKDIR /usr/src/apps/back
USER bun
EXPOSE 3333/tcp
ENTRYPOINT [ "bun", "start" ]
