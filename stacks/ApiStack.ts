import { Api, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack }: StackContext) {
  const { reservations } = use(StorageStack);

  // Create the API
  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        bind: [reservations],
      },
    },
    routes: {
      "POST /apartments/{apartment}/reservations/{date}":
        "packages/functions/src/createOne.main",
      "GET /apartments/{apartment}/reservations":
        "packages/functions/src/getAll.main",
      "GET /apartments/{apartment}/reservations/{date}":
        "packages/functions/src/getOne.main",
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  // Return the API resource
  return {
    api,
  };
}
