import { Table } from "sst/node/table";
import handler from "@notes/core/handler";
import dynamoDb from "@notes/core/dynamodb";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

export const main = handler(async (event: APIGatewayProxyEvent) => {
  const params: DocumentClient.QueryInput = {
    TableName: Table.Reservations.tableName,
    KeyConditionExpression:
      "apartmentId = :apartmentId and reservationId between :from and :to",
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be the id of the author
    ExpressionAttributeValues: {
      ":apartmentId": event?.pathParameters?.apartment,
      ":from": event?.queryStringParameters?.from || "00000000",
      ":to": event?.queryStringParameters?.to || "99999999",
    },
    // Limit: +(event?.queryStringParameters?.limit ?? Infinity),
  };

  const result = await dynamoDb.query(params);

  // Return the retrieved item
  return JSON.stringify(result);
});
