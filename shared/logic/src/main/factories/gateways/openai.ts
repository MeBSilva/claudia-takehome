import { z } from "zod";
import { AxiosHttpClient } from "../../../infra/gateways/axios";

import { OpenAIGateway } from "../../../infra/gateways/openai";
import { ZodValidator } from "../../../application/validators/ZodValidator";
import { server } from "../../constants/server";

export const makeOpenAIGateway = (): OpenAIGateway =>
  new OpenAIGateway(
    new AxiosHttpClient(),
    {
      promptSuccessPayload:
        new ZodValidator<OpenAIGateway.PromptSuccessPayload>(
          z.object({
            choices: z
              .object({
                index: z.number(),
                message: z.object({
                  role: z.literal("assistant"),
                  content: z.string().nullable(),
                  refusal: z.string().nullable(),
                }),
                finish_reason: z.enum(["stop", "length", "content_filter"]),
              })
              .array(),
          }),
        ),
      createEmbeddingSuccessPayload:
        new ZodValidator<OpenAIGateway.CreateEmbeddingSuccessPayload>(
          z.object({
            data: z
              .object({
                object: z.literal("embedding"),
                index: z.number(),
                embedding: z.number().array(),
              })
              .array(),
          }),
        ),
    },
    server.openaiUrl,
    server.openaiApiKey,
  );
