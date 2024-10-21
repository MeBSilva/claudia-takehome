export type SemanticSearchGateway = {
  search: (
    params: SemanticSearchGateway.Params,
  ) => SemanticSearchGateway.Result;
};

export declare namespace SemanticSearchGateway {
  type Params = { embedding: number[] };
  type Result = Promise<
    {
      confidence: number;
      response: string;
    }[]
  >;
}
