import { LocalMessageRepository } from "../../../infra/repositories/local/MessageRepository";

export const makeLocalMessageRepository = () => new LocalMessageRepository();
