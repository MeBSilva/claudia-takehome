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

RUN mkdir -p /temp/prod
WORKDIR /temp/prod
COPY package.json bun.lockb ./
COPY apps/back/package.json apps/back/package.json
COPY apps/web/package.json apps/web/package.json
COPY shared/logic/package.json shared/logic/package.json
RUN bun install --frozen-lockfile --production

FROM base-step AS bundle-step
COPY --from=install-step /temp/dev/node_modules node_modules
COPY tsconfig.json .
COPY apps/web apps/web
WORKDIR /usr/src/apps/web
RUN bun run build

FROM base-step AS release-step
COPY --from=install-step /temp/prod/node_modules node_modules
COPY --from=bundle-step /usr/src/apps/web/package.json .
COPY --from=bundle-step /usr/src/apps/web/build /usr/src/apps/web/build
COPY --from=bundle-step /usr/src/apps/web/public /usr/src/apps/web/public

WORKDIR /usr/src/apps/web
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "start" ]
