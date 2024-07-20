import AWS from "aws-sdk";

const sqs = new AWS.SQS();

export default {
  sendMessage: (params: AWS.SQS.Types.SendMessageRequest) =>
    sqs.sendMessage(params).promise(),
};
