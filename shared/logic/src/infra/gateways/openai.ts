import type {
  PromptLanguageModelGateway,
  CreateEmbeddingGateway,
} from "../../domain/contracts/gateways/LanguageModel";
import type {
  HttpClient,
  HttpMethod,
  HttpResponse,
} from "../../application/contracts/HttpClient";
import type { Validator } from "../../application/contracts/Validator";
import { ExternalApiError } from "../../application/errors/ExternalApi";

export class OpenAIGateway
  implements CreateEmbeddingGateway, PromptLanguageModelGateway
{
  constructor(
    private readonly httpClient: HttpClient,
    private readonly validators: {
      createEmbeddingSuccessPayload: Validator<OpenAIGateway.CreateEmbeddingSuccessPayload>;
      promptSuccessPayload: Validator<OpenAIGateway.PromptSuccessPayload>;
    },
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {}

  public async createEmbedding({
    prompt,
  }: CreateEmbeddingGateway.Params): CreateEmbeddingGateway.Result {
    const response = await this.request({
      method: "post",
      body: {
        input: prompt,
        model: "text-embedding-3-large",
      },
      endpoint: "embeddings",
      validator: this.validators.createEmbeddingSuccessPayload,
    });
    if (response.statusCode !== 200) throw new Error();

    return response.body.data[0].embedding;
  }

  public async prompt({
    prompt,
    context,
  }: PromptLanguageModelGateway.Params): PromptLanguageModelGateway.Result {
    const textLength = prompt.length + context.length;

    if (textLength > 100) throw new Error("Payload too large");

    const response = await this.request({
      method: "post",
      body: {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a CX specialist. Keep in mind that ${context}. 
            You should not answer anything unrelated to customer support.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      endpoint: "chat/completions",
      validator: this.validators.promptSuccessPayload,
    });

    if (response.statusCode !== 200) throw new Error();
    if (!response.body.choices[0].message.content) throw new Error();

    return response.body.choices[0].message.content;
  }

  private async request<T>({
    body,
    endpoint,
    method,
    validator,
  }: {
    endpoint: string;
    body: unknown;
    method: HttpMethod;
    validator: Validator<T>;
  }): Promise<HttpResponse<T>> {
    try {
      const response = await this.httpClient.request<T>({
        method,
        url: `${this.baseUrl}/${endpoint}`,
        headers: { Authorization: `Bearer ${this.apiKey}` },
        body,
      });

      const validated = validator.validate(response.body);

      if (!validated.success) throw validated.error;

      return response;
    } catch (error) {
      throw new ExternalApiError("OpenAIGateway", error);
    }
  }
}

export declare namespace OpenAIGateway {
  type CreateEmbeddingSuccessPayload = {
    data: { object: "embedding"; index: number; embedding: number[] }[];
  };
  type PromptSuccessPayload = {
    choices: {
      index: number;
      message: {
        role: "assistant";
        content: string | null;
        refusal: string | null;
      };
      finish_reason: "stop" | "length" | "content_filter";
    }[];
  };
}
