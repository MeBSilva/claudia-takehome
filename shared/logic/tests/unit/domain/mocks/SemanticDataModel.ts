import type { SemanticSearchGateway } from "../../../../src/domain/contracts/gateways/SemanticDataModel";

import { mock } from "bun:test";

export const mockSemanticSearchGateway = mock(
  (mockResult?: SemanticSearchGateway.Result): SemanticSearchGateway => ({
    search: async ({ embedding }) =>
      mockResult ?? [
        { confidence: 1, content: "FAQ entry", response: "FAQ entry" },
      ],
  }),
);
