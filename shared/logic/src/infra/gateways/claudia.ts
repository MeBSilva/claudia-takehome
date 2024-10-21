import type { SemanticSearchGateway } from "../../domain/contracts/gateways/SemanticDataModel";
import type {
  HttpClient,
  HttpMethod,
  HttpRequest,
  HttpResponse,
} from "../../application/contracts/HttpClient";
import type { Validator } from "../../application/contracts/Validator";
import { ExternalApiError } from "../../application/errors/ExternalApi";

export class ClaudIASemanticDBGateway implements SemanticSearchGateway {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly validators: {
      semanticSearchSuccessPayload: Validator<ClaudIASemanticDBGateway.SemanticSearchSuccessPayload>;
    },
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {}

  public async search({
    embedding,
  }: SemanticSearchGateway.Params): SemanticSearchGateway.Result {
    const response = await this.request({
      method: "post",
      body: {
        count: true,
        select: "id,content,response",
        top: 10,
        filter: "projectName eq 'claudia'",
        vectorQueries: [
          {
            vector: embedding,
            k: 3,
            fields: "embeddings",
            kind: "vector",
          },
        ],
      },
      endpoint: "indexes/claudia-ids-index-large/docs/search",
      validator: this.validators.semanticSearchSuccessPayload,
      params: { "api-version": "2023-11-01" },
    });

    if (response.statusCode !== 200) throw new Error();

    return response.body.value.map(({ content, response, ...rest }) => ({
      confidence: rest["@search.score"],
      response,
    }));
  }

  private async request<T>({
    body,
    endpoint,
    method,
    validator,
    params,
  }: {
    endpoint: string;
    body: unknown;
    method: HttpMethod;
    validator: Validator<T>;
    params?: HttpRequest["params"];
  }): Promise<HttpResponse<T>> {
    try {
      const response = await this.httpClient.request<T>({
        method,
        url: `${this.baseUrl}/${endpoint}`,
        headers: { "api-key": `${this.apiKey}` },
        body,
        params,
      });

      const validated = validator.validate(response.body);

      if (!validated.success) throw validated.error;

      return response;
    } catch (error) {
      throw new ExternalApiError("ClaudIASemanticDBGateway", error);
    }
  }
}

export declare namespace ClaudIASemanticDBGateway {
  type SemanticSearchSuccessPayload = {
    value: {
      "@search.score": number;
      id: string;
      response: string;
      content: string;
    }[];
  };
}
