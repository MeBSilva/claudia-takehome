import { describe, it, expect } from "bun:test";
import type { CreateEmbeddingGateway } from "../../../../src/domain/contracts/gateways/LanguageModel";
import { OpenAIGateway } from "../../../../src/infra/gateways/openai";
import { faker } from "@faker-js/faker";
import { httpClientMock } from "../mocks/HttpClient";

describe("OpenAiGateway", () => {
  it("Should create an embedding successfully", async () => {
    const embedding = await Bun.file(
      `${import.meta.dir}/${"embedding.txt"}`,
    ).json();

    const sut = new OpenAIGateway(
      httpClientMock({
        data: [
          {
            object: "embedding",
            index: faker.number.int({ min: 0, max: 100 }),
            embedding,
          },
        ],
      } satisfies OpenAIGateway.CreateEmbeddingSuccessPayload),
      {
        createEmbeddingSuccessPayload: {
          validate: (param) => ({
            success: true,
            data: param as OpenAIGateway.CreateEmbeddingSuccessPayload,
          }),
        },
        promptSuccessPayload: {
          validate: (param) => ({
            success: true,
            data: param as OpenAIGateway.PromptSuccessPayload,
          }),
        },
      },
      faker.internet.url(),
      faker.string.alphanumeric(),
    );
    const prompt = "Queria trabalhar pra vcs!";

    expect(sut.createEmbedding({ prompt })).resolves.toEqual(
      embedding satisfies Awaited<CreateEmbeddingGateway.Result>,
    );
  });

  it("Should answer a prompt successfully", async () => {
    const content =
      "Infelizmente não temos nenhuma vaga disponível, mas desejo muita sorte e crescimento profissional para você! Se surgir uma oportunidade no futuro, ficaremos felizes em receber sua candidatura.";

    const sut = new OpenAIGateway(
      httpClientMock({
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content,
              refusal: null,
            },
            finish_reason: "stop",
          },
        ],
      } satisfies OpenAIGateway.PromptSuccessPayload),
      {
        createEmbeddingSuccessPayload: {
          validate: (param) => ({
            success: true,
            data: param as OpenAIGateway.CreateEmbeddingSuccessPayload,
          }),
        },
        promptSuccessPayload: {
          validate: (param) => ({
            success: true,
            data: param as OpenAIGateway.PromptSuccessPayload,
          }),
        },
      },
      faker.internet.url(),
      faker.string.alphanumeric(),
    );
    const prompt = "Queria trabalhar pra vcs!";

    expect(sut.prompt({ prompt, context: content })).resolves.toEqual(content);
  });
});
