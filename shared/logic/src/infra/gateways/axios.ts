import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import type {
  HttpClient,
  HttpRequest,
  HttpResponse,
} from "../../application/contracts/HttpClient";

const isAxiosError = (err: Error): err is AxiosError => axios.isAxiosError(err);

export class AxiosHttpClient implements HttpClient {
  private readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create();
    this.interceptorClient(this.instance);
  }

  public async request<T, U>({
    url,
    method,
    body,
    headers,
    params,
  }: HttpRequest<T>): Promise<HttpResponse<U>> {
    const axiosResponse: AxiosResponse = await this.instance.request({
      url,
      method,
      data: body,
      headers,
      params,
    });

    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
    };
  }

  private interceptorClient(instance: AxiosInstance) {
    instance.interceptors.request.use(
      (config) => config,
      (err: Error | AxiosError) => {
        if (isAxiosError(err) && err.request)
          throw new Error("Failed to send request.");
        throw err;
      },
    );

    instance.interceptors.response.use(
      (response) => response,
      (err: Error | AxiosError) => {
        if (isAxiosError(err) && err.response) throw err.response.data;
        throw err;
      },
    );
  }
}
