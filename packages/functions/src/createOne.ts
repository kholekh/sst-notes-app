import { SQSEvent } from "aws-lambda";
import { Queue } from "sst/node/queue";
import { Table } from "sst/node/table";
import handler from "@notes/core/handler";
import dynamoDb from "@notes/core/dynamodb";
import sqs from "@notes/core/queue";

interface IReservation {
  readonly apartmentId: string;
  readonly reservationId: string;
  readonly guestId: string;
}

export const main = handler(async (event) => {
  const apartmentId = event?.pathParameters?.apartment;
  const reservationId = event?.pathParameters?.date; //TODO: validate format YYYYMMDD
  const guestId = "123"; //TODO: form Cognito

  await sqs.sendMessage({
    // Get the queue url from the environment variable
    QueueUrl: Queue.Queue.queueUrl,
    MessageBody: JSON.stringify({
      apartmentId,
      reservationId,
      guestId,
    } as IReservation),
  });

  return "Message queued!";
});

export const consumer = async (event: SQSEvent) => {
  const [record] = event.Records;
  console.log(`Message processed: "${record?.body}"`);

  const { apartmentId, reservationId, guestId } = JSON.parse(
    record?.body
  ) as IReservation;

  const params = {
    TableName: Table.Reservations.tableName,
    Item: {
      apartmentId,
      reservationId,
      guestId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  };

  await dynamoDb.put(params);

  return JSON.stringify(params.Item);
};
