import { StackContext, Queue, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function QueueStack({ stack }: StackContext) {
  const { reservations: reservationsTable } = use(StorageStack);

  // Create Queue
  const reservations = new Queue(stack, "Queue", {
    consumer: {
      function: {
        bind: [reservationsTable],
        handler: "packages/functions/src/createOne.consumer",
      },
    },
  });

  return { reservations };
}
