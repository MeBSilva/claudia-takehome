FROM oven/bun:alpine AS base-step
WORKDIR /usr/src
ENV NODE_ENV=production

FROM base-step AS install-step
RUN mkdir -p /temp/dev
WORKDIR /temp/dev
COPY package.json bun.lockb ./
COPY apps/back/package.json apps/back/package.json
COPY apps/web/package.json apps/web/package.json
COPY shared/logic/package.json shared/logic/package.json
RUN bun install --frozen-lockfile

FROM base-step AS bundle-step
COPY --from=install-step /temp/dev/node_modules node_modules
COPY tsconfig.json .
COPY apps/back apps/back
COPY shared/logic shared/logic
WORKDIR /usr/src/apps/back
RUN bun run build

FROM base-step AS release-step
COPY --from=bundle-step /usr/src/apps/back/package.json .
COPY --from=bundle-step /usr/src/apps/back/build /usr/src/apps/back/build

WORKDIR /usr/src/apps/back
USER bun
EXPOSE 3333/tcp
ENTRYPOINT [ "bun", "start" ]
