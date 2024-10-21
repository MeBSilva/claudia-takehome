import type { Message } from "../../models/Message";

export type ListMessagesRepository = {
  list: (
    params: ListMessagesRepository.Params,
  ) => ListMessagesRepository.Result;
};

export declare namespace ListMessagesRepository {
  type Params = { conversationId: string };
  type Result = Promise<Message[]>;
}

export type CreateMessageRepository = {
  create: (
    params: CreateMessageRepository.Params,
  ) => CreateMessageRepository.Result;
};

export declare namespace CreateMessageRepository {
  type Params = { message: Message };
  type Result = Promise<Message>;
}
