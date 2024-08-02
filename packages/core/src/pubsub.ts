import {
  IoTDataPlaneClient,
  PublishCommand,
} from "@aws-sdk/client-iot-data-plane";

const client = new IoTDataPlaneClient();

export default {
  publish: async (topic: string, payload: any) => {
    const command = new PublishCommand({
      topic,
      payload: JSON.stringify(payload),
      qos: 1,
    });
    await client.send(command);
  },
};
