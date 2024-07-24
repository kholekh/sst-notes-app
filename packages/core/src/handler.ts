import { Context, APIGatewayProxyEvent, SQSEvent } from "aws-lambda";

type TEvent = APIGatewayProxyEvent | SQSEvent;

interface IResponse {
  readonly statusCode: number;
  readonly headers?: Record<string, any>;
  readonly body: string;
}

type TLambda<E = TEvent, R = string> = (
  event: E,
  context: Context
) => Promise<R>;

type TLambdaAPI<R = string> = TLambda<APIGatewayProxyEvent, R>;
type TLambdaSQS<R = string> = TLambda<SQSEvent, R>;

export default function handler(lambda: TLambdaAPI): TLambdaAPI<IResponse>;
export default function handler(lambda: TLambdaSQS): TLambdaSQS<IResponse>;
export default function handler(
  lambda: TLambdaAPI | TLambdaSQS
): TLambdaAPI<IResponse> | TLambdaSQS<IResponse> {
  return async function (event: TEvent, context: Context): Promise<IResponse> {
    const { body, statusCode } = await (async (): Promise<IResponse> => {
      try {
        // Run the Lambda
        const body = await lambda(event as any, context);
        const statusCode = 200;

        return { statusCode, body };
      } catch (error) {
        console.error(error);

        const statusCode = 500;
        const body = JSON.stringify({
          error: error instanceof Error ? error.message : String(error),
        });

        return { statusCode, body };
      }
    })();

    // Return HTTP response
    return {
      statusCode,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body,
    };
  };
}
