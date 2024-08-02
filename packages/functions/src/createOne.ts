import { APIGatewayProxyEvent, Context, SQSEvent } from "aws-lambda";
import { Queue } from "sst/node/queue";
import { Table } from "sst/node/table";
import auth from "@notes/core/auth";
import handler from "@notes/core/handler";
import dynamoDb from "@notes/core/dynamodb";
import sqs from "@notes/core/queue";
import pubsub from "@notes/core/pubsub";

interface IReservation {
  readonly apartmentId: string;
  readonly reservationId: string;
  readonly guestId: string;
}

export const main = handler(async (event: APIGatewayProxyEvent, context: Context) => {
  const requestId = context.awsRequestId;
  const apartmentId = event?.pathParameters?.apartment!;
  const reservationId = event?.pathParameters?.date!; //TODO: validate format YYYYMMDD
  const guestId = auth.getGuest(event);
  const reservation: IReservation = {
    apartmentId,
    reservationId,
    guestId,
  };

  await sqs.sendMessage({
    // Get the queue url from the environment variable
    QueueUrl: Queue.Reservations.queueUrl,
    MessageBody: JSON.stringify({ ...reservation, requestId }),
    MessageGroupId: apartmentId,
  });

  return JSON.stringify({ status: "Message queued!" });
});

export const consumer = handler(
  async (event: SQSEvent, context: Context): Promise<string> => {
    const [record] = event.Records;
    console.log(`Message processed: "${record?.body}"`);

    const { apartmentId, reservationId, guestId } = JSON.parse(
      record?.body
    ) as IReservation;

    const ReservationsTable = Table.Reservations.tableName;

    const getOneParams = {
      TableName: ReservationsTable,
      Key: {
        apartmentId,
        reservationId,
      },
    };

    const result = await dynamoDb.get(getOneParams);
    if (result.Item) {
      console.log("Reservations for this apartment/date already exist.");
      return JSON.stringify(result.Item);
    }

    const putOneParams = {
      TableName: ReservationsTable,
      Item: {
        apartmentId,
        reservationId,
        guestId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    };

    await dynamoDb.put(putOneParams);

    await pubsub.publish("reserve", reservationId);

    return JSON.stringify(putOneParams.Item);
  }
);
