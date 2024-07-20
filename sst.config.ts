import { SSTConfig } from "sst";
import { StorageStack } from "./stacks/StorageStack";
import { ApiStack } from "./stacks/ApiStack";
import { QueueStack } from "./stacks/QueueStack";

export default {
  config(_input) {
    return {
      name: "obriy",
      region: "eu-central-1",
    };
  },
  stacks(app) {
    app.stack(StorageStack).stack(QueueStack).stack(ApiStack);
  },
} satisfies SSTConfig;
