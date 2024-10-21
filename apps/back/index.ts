import { Hono } from "hono";
import type { UnofficialStatusCode } from "hono/utils/http-status";
import { getHttpController } from "logic";

const app = new Hono();

app.post("/features/*", async (c) => {
  const { path: requestPath } = c.req;
  const path = requestPath.split("/").slice(2);

  const controller = getHttpController(path);

  if (!controller) return c.notFound();

  const requestBody = await c.req.json();

  const response = await controller.handle({
    method: "post",
    url: requestPath,
    body: requestBody,
    headers: c.req.header(),
    params: c.req.query(),
  });

  if (!response.body) return c.status(201);

  return c.json(response.body, response.statusCode as UnofficialStatusCode);
});

const port = 3333;
console.log(`Server is running on port ${port}`);

export default { fetch: app.fetch, port };
