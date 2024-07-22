import auth from "@notes/core/auth";
import dynamoDb from "@notes/core/dynamodb";
import handler from "@notes/core/handler";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Table } from "sst/node/table";

export const main = handler(async (event: APIGatewayProxyEvent, context) => {
  const apartmentId = event?.pathParameters?.apartment!;
  const reservationId = event?.pathParameters?.date!; //TODO: validate format YYYYMMDD
  const guestId = auth.getGuest(event);

  const params = {
    TableName: Table.Reservations.tableName,
    Key: {
      apartmentId,
      reservationId,
    },
  };

  const result = await dynamoDb.get(params);
  console.log(result);
  if (!result.Item) {
    throw new Error("Item not found.");
  }

  if (result.Item.guestId !== guestId) {
    throw new Error("Permission denied!");
  }

  await dynamoDb.delete(params);

  return JSON.stringify("Reservation deleted!");
});
