import type {
  CreateMessageRepository,
  ListMessagesRepository,
} from "../../../domain/contracts/repositories/Message";
import type { Message } from "../../../domain/models/Message";

const data: { messages: Message[] } = { messages: [] };
export class LocalMessageRepository
  implements ListMessagesRepository, CreateMessageRepository
{
  public async list({
    conversationId,
  }: ListMessagesRepository.Params): ListMessagesRepository.Result {
    return data.messages.filter(
      (message) => message.conversationId === conversationId,
    );
  }

  public async create({
    message,
  }: CreateMessageRepository.Params): CreateMessageRepository.Result {
    data.messages.push(message);

    return message;
  }
}
