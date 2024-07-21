import AWS from "aws-sdk";

const sqs = new AWS.SQS();

export default {
  sendMessage: (params: AWS.SQS.Types.SendMessageRequest) =>
    sqs.sendMessage(params).promise(),
  deleteMessage: (params: AWS.SQS.Types.DeleteMessageRequest) =>
    sqs.deleteMessage(params).promise(),
  getQueueUrl: (params: AWS.SQS.Types.GetQueueUrlRequest) =>
    sqs.getQueueUrl(params).promise(),
  config: sqs.config,
};
