import { z } from "zod";
import { AxiosHttpClient } from "../../../infra/gateways/axios";
import { ClaudIASemanticDBGateway } from "../../../infra/gateways/claudia";
import { ZodValidator } from "../../../application/validators/ZodValidator";
import { server } from "../../constants/server";

export const makeClaudIASemanticDBGateway = (): ClaudIASemanticDBGateway =>
  new ClaudIASemanticDBGateway(
    new AxiosHttpClient(),
    {
      semanticSearchSuccessPayload:
        new ZodValidator<ClaudIASemanticDBGateway.SemanticSearchSuccessPayload>(
          z.object({
            value: z
              .object({
                "@search.score": z.number(),
                id: z.string(),
                response: z.string(),
                content: z.string(),
              })
              .array(),
          }),
        ),
    },
    server.claudiaUrl,
    server.claudiaApiKey,
  );
