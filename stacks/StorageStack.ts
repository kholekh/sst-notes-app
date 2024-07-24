import { Bucket, StackContext, Table } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
  const bucket = new Bucket(stack, "Uploads", {
    cors: [
      {
        maxAge: "1 day",
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
      },
    ],
  });

  // const guests = new Table(stack, "Guests", {
  //   fields: {
  //     guestId: "string",
  //   },
  //   primaryIndex: { partitionKey: "guestId" },
  // });

  // const apartments = new Table(stack, "Apartments", {
  //   fields: {
  //     apartmentId: "string",
  //   },
  //   primaryIndex: { partitionKey: "apartmentId" },
  // });

  const reservations = new Table(stack, "Reservations", {
    fields: {
      reservationId: "string", //YYYYMMDD
      apartmentId: "string",
      guestId: "string",
    },
    primaryIndex: { partitionKey: "apartmentId", sortKey: "reservationId" },
    localIndexes: { guests: { sortKey: "guestId" } },
  });

  return {
    bucket,
    // guests,
    // apartments,
    reservations,
  };
}
