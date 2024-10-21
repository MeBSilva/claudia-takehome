import type { ListMessagesRepository } from "../contracts/repositories/Message";
import type { Feature } from "../feature";
import type { Message } from "../models/Message";

export class ListMessages
  implements Feature<ListMessages.Params, ListMessages.Result>
{
  constructor(
    private readonly listMessagesRepository: ListMessagesRepository,
  ) {}

  public async call({
    conversationId,
  }: ListMessages.Params): ListMessages.Result {
    const messages = await this.listMessagesRepository.list({ conversationId });

    return messages;
  }
}

export declare namespace ListMessages {
  type Params = { conversationId: string };
  type Result = Promise<Message[]>;
}
