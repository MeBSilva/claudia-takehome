import { describe, it, expect } from "bun:test";
import { SendMessage } from "../../../../src/domain/features/SendMessage";
import {
  mockEmbeddingGateway,
  mockPromptLanguageModelGateway,
} from "../mocks/LanguageModel";
import { mockSemanticSearchGateway } from "../mocks/SemanticDataModel";
import {
  mockCreateMessageRepository,
  mockListMessagesRepository,
} from "../mocks/Message";

describe("SendMessage", () => {
  const sut = new SendMessage(
    mockListMessagesRepository(),
    mockCreateMessageRepository(),
    mockEmbeddingGateway(),
    mockSemanticSearchGateway(),
    mockPromptLanguageModelGateway(),
  );

  it("Should receive a message and answer it", () => {
    const message = "Are you there?";

    expect(
      sut.call({ conversationId: "1", content: message, userId: 1 }),
    ).resolves.toEqual({
      answer: "Answer",
    } satisfies Awaited<SendMessage.Result>);
  });
});
