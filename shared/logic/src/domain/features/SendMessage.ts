import type {
  CreateEmbeddingGateway,
  PromptLanguageModelGateway,
} from "../contracts/gateways/LanguageModel";
import type { SemanticSearchGateway } from "../contracts/gateways/SemanticDataModel";
import type {
  CreateMessageRepository,
  ListMessagesRepository,
} from "../contracts/repositories/Message";
import type { Feature } from "../feature";
import type { Message } from "../models/Message";

export class SendMessage
  implements Feature<SendMessage.Params, SendMessage.Result>
{
  constructor(
    private readonly listMessagesRepository: ListMessagesRepository,
    private readonly createMessageRepository: CreateMessageRepository,
    private readonly createEmbeddingGateway: CreateEmbeddingGateway,
    private readonly searchSemanticDatabaseGateway: SemanticSearchGateway,
    private readonly promptLanguageModelGateway: PromptLanguageModelGateway,
  ) {}

  public async call({
    conversationId,
    content,
    userId,
  }: SendMessage.Params): SendMessage.Result {
    await this.createMessageRepository.create({
      message: { content, conversationId, userId },
    });
    const messages = await this.listMessagesRepository.list({ conversationId });

    const embedding = await this.createEmbeddingGateway.createEmbedding({
      prompt: content,
    });

    const searchResults = await this.searchSemanticDatabaseGateway.search({
      embedding,
    });

    const answer = await this.promptLanguageModelGateway.prompt({
      context: searchResults[0].response,
      prompt: content,
    });

    await this.createMessageRepository.create({
      message: { content: answer, conversationId, userId: -1 },
    });

    return { answer };
  }
}

export declare namespace SendMessage {
  type Params = Message;
  type Result = Promise<{ answer: string }>;
}
