import { Api, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";
import { QueueStack } from "./QueueStack";

export function ApiStack({ stack }: StackContext) {
  const { reservations: reservationsTable } = use(StorageStack);
  const { reservations: reservationsQueue } = use(QueueStack);

  // Create the API
  const api = new Api(stack, "Api", {
    defaults: {
      // authorizer: "iam",
      function: {
        bind: [reservationsTable, reservationsQueue],
      },
    },
    routes: {
      "POST /apartments/{apartment}/reservations/{date}": {
        authorizer: "iam",
        function: "packages/functions/src/createOne.main",
      },
      "GET /apartments/{apartment}/reservations":
        "packages/functions/src/getAll.main",
      "GET /apartments/{apartment}/reservations/{date}":
        "packages/functions/src/getOne.main",
      "DELETE /apartments/{apartment}/reservations/{date}": {
        authorizer: "iam",
        function: "packages/functions/src/deleteOne.main",
      },
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
