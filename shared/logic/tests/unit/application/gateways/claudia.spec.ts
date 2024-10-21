import { describe, it, expect } from "bun:test";
import { faker } from "@faker-js/faker";
import { httpClientMock } from "../mocks/HttpClient";
import { ClaudIASemanticDBGateway } from "../../../../src/infra/gateways/claudia";

describe("ClaudIAGateway", () => {
  it("Should create an embedding successfully", async () => {
    const embedding = await Bun.file(
      `${import.meta.dir}/${"embedding.txt"}`,
    ).json();

    const response = faker.lorem.sentence();
    const confidence = faker.number.float({
      max: 1,
      min: 0,
      fractionDigits: 6,
    });

    const sut = new ClaudIASemanticDBGateway(
      httpClientMock({
        value: [
          {
            "@search.score": confidence,
            id: faker.string.alphanumeric(),
            response,
            content: faker.lorem.sentence(),
          },
        ],
      } satisfies ClaudIASemanticDBGateway.SemanticSearchSuccessPayload),
      {
        semanticSearchSuccessPayload: {
          validate: (param) => ({
            success: true,
            data: param as ClaudIASemanticDBGateway.SemanticSearchSuccessPayload,
          }),
        },
      },
      faker.internet.url(),
      faker.string.alphanumeric(),
    );

    expect(sut.search({ embedding })).resolves.toEqual([
      { confidence, response },
    ]);
  });
});
