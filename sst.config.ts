import { SSTConfig } from "sst";
import { StorageStack } from "./stacks/StorageStack";

export default {
  config(_input) {
    return {
      name: "obriy",
      region: "eu-central-1",
    };
  },
  stacks(app) {
    app.stack(StorageStack);
  },
} satisfies SSTConfig;
