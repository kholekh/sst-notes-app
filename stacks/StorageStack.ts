import { Bucket, StackContext, Table } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
  const bucket = new Bucket(stack, "Uploads");

  const guests = new Table(stack, "Guests", {
    fields: {
      guestId: "string",
    },
    primaryIndex: { partitionKey: "guestId" },
  });

  const apartments = new Table(stack, "Apartments", {
    fields: {
      apartmentId: "string",
    },
    primaryIndex: { partitionKey: "apartmentId" },
  });

  const reservations = new Table(stack, "Reservations", {
    fields: {
      reservationId: "string", //YYYYMMDD
      apartmentId: "string",
      guestId: "string",
    },
    primaryIndex: { partitionKey: "reservationId", sortKey: "apartmentId" },
    localIndexes: { guests: { sortKey: "guestId" } },
    globalIndexes: {
      apartments: { partitionKey: "apartmentId", sortKey: "guestId" },
    },
  });

  return {
    bucket,
    guests,
    apartments,
    reservations,
  };
}
