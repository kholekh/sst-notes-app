import { Context, APIGatewayProxyEvent, SQSEvent } from "aws-lambda";

type TEvent = APIGatewayProxyEvent | SQSEvent;

interface IResponse {
  readonly statusCode: number;
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
    let body, statusCode;

    try {
      // Run the Lambda
      body = await lambda(event as any, context);
      statusCode = 200;
    } catch (error) {
      console.error(error);

      statusCode = 500;
      body = JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Return HTTP response
    return {
      body,
      statusCode,
    };
  };
}
