export type HttpMethod = "delete" | "get" | "patch" | "post" | "put";

export type HttpRequest<T = unknown> = {
  url: string;
  method: HttpMethod;
  body: T;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
};

export type HttpResponse<T = unknown> = { statusCode: number; body: T };

export type HttpClient = {
  request: <Res = unknown, Req = unknown>(
    data: HttpRequest<Req>,
  ) => Promise<HttpResponse<Res>>;
};
