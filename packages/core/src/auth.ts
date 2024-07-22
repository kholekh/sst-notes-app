import { APIGatewayProxyEvent } from "aws-lambda";

export default {
  getGuest: (event: APIGatewayProxyEvent): string => {
    const guestId =
      event.requestContext.authorizer?.iam.cognitoIdentity.identityId;
    if (!guestId) {
      throw new Error("You are not authorized!");
    }

    return String(guestId);
  },
};
