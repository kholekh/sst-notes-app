import { StackContext, Queue, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function QueueStack({ stack }: StackContext) {
  const { reservations: reservationsTable } = use(StorageStack);

  const reservations = new Queue(stack, "Reservations", {
    consumer: {
      function: {
        bind: [reservationsTable],
        handler: "packages/functions/src/createOne.consumer",
      },
    },
    cdk: {
      queue: {
        fifo: true,
        contentBasedDeduplication: true,
      },
    },
  });

  return { reservations };
}
