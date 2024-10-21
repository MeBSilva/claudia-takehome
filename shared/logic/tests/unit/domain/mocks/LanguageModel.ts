import type {
  CreateEmbeddingGateway,
  PromptLanguageModelGateway,
} from "../../../../src/domain/contracts/gateways/LanguageModel";

import { mock } from "bun:test";

export const mockEmbeddingGateway = mock(
  (mockResult?: CreateEmbeddingGateway.Result): CreateEmbeddingGateway => ({
    createEmbedding: async ({ prompt }) =>
      mockResult ?? prompt.split("").map(Number),
  }),
);

export const mockPromptLanguageModelGateway = mock(
  (
    mockResult?: PromptLanguageModelGateway.Result,
  ): PromptLanguageModelGateway => ({
    prompt: async ({ prompt }) => mockResult ?? "Answer",
  }),
);
