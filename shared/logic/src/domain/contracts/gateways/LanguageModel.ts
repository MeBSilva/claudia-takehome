export type CreateEmbeddingGateway = {
  createEmbedding: (
    params: CreateEmbeddingGateway.Params,
  ) => CreateEmbeddingGateway.Result;
};
export declare namespace CreateEmbeddingGateway {
  type Params = { prompt: string };
  type Result = Promise<number[]>;
}

export type PromptLanguageModelGateway = {
  prompt: (
    params: PromptLanguageModelGateway.Params,
  ) => PromptLanguageModelGateway.Result;
};
export declare namespace PromptLanguageModelGateway {
  type Params = { context: string; prompt: string };
  type Result = Promise<string>;
}
