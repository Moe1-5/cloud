import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { env } from "./env.js";

const clientConfig: DynamoDBClientConfig = {
  region: env.AWS_REGION
};

if (env.DYNAMODB_ENDPOINT) {
  clientConfig.endpoint = env.DYNAMODB_ENDPOINT;
}

const client = new DynamoDBClient(clientConfig);

export const dynamoDb = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true
  }
});
