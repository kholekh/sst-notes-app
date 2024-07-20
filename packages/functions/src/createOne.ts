import { Table } from "sst/node/table";
import handler from "@notes/core/handler";
import dynamoDb from "@notes/core/dynamodb";

export const main = handler(async (event) => {
  const params = {
    TableName: Table.Reservations.tableName,
    Item: {
      apartmentId: event?.pathParameters?.apartment,
      reservationId: event?.pathParameters?.date, //TODO: validate format YYYYMMDD
      guestId: "123", //TODO: form Cognito
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  };

  await dynamoDb.put(params);

  return JSON.stringify(params.Item);
});
