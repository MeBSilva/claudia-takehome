import { z } from "zod";
import { HttpControllerDecorator } from "../../../application/controllers/HttpController";
import { PinoLogger } from "../../../application/loggers/pino";
import { ZodValidator } from "../../../application/validators/ZodValidator";
import { SendMessage } from "../../../domain/features/SendMessage";
import { makeLocalMessageRepository } from "../../factories/repositories/localMessage";
import { makeOpenAIGateway } from "../../factories/gateways/openai";
import { makeClaudIASemanticDBGateway } from "../../factories/gateways/claudia";
import { server } from "../../constants/server";

const localMessageRepository = makeLocalMessageRepository();
const openAIGateway = makeOpenAIGateway();
const claudiaGateway = makeClaudIASemanticDBGateway();

export const send = new HttpControllerDecorator(
  "SendMessage",
  new SendMessage(
    localMessageRepository,
    localMessageRepository,
    openAIGateway,
    claudiaGateway,
    openAIGateway,
  ),
  new ZodValidator<SendMessage.Params>(
    z.object({
      conversationId: z.string(),
      content: z.string(),
      userId: z.number(),
    }),
  ),
  new PinoLogger(server.environment),
);
