import type { HttpClient } from "../../../../src/application/contracts/HttpClient";
import { mock } from "bun:test";

export const httpClientMock = mock(
  (mockResponse?: unknown): HttpClient => ({
    request: async <Res>() => ({
      statusCode: 200,
      body: (mockResponse ?? {}) as Res,
    }),
  }),
);
