import type {
  CreateMessageRepository,
  ListMessagesRepository,
} from "../../../../src/domain/contracts/repositories/Message";

import { mock } from "bun:test";

export const mockListMessagesRepository = mock(
  (mockResult?: ListMessagesRepository.Result): ListMessagesRepository => ({
    list: async ({ conversationId }) =>
      mockResult ?? [{ conversationId: "1", content: "message", userId: 1 }],
  }),
);

export const mockCreateMessageRepository = mock(
  (mockResult?: CreateMessageRepository.Result): CreateMessageRepository => ({
    create: async () =>
      mockResult ?? { conversationId: "1", content: "message", userId: 1 },
  }),
);
