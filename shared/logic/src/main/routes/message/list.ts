import { z } from "zod";
import { HttpControllerDecorator } from "../../../application/controllers/HttpController";
import { PinoLogger } from "../../../application/loggers/pino";
import { ZodValidator } from "../../../application/validators/ZodValidator";
import { ListMessages } from "../../../domain/features/ListMessages";
import { makeLocalMessageRepository } from "../../factories/repositories/localMessage";
import { server } from "../../constants/server";

const localMessageRepository = makeLocalMessageRepository();

export const list = new HttpControllerDecorator(
  "ListMessages",
  new ListMessages(localMessageRepository),
  new ZodValidator<ListMessages.Params>(
    z.object({
      conversationId: z.string(),
    }),
  ),
  new PinoLogger(server.environment),
);
