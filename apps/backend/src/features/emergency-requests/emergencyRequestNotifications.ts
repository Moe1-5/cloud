import type { EmergencyRequestRecord } from "@ddac/shared";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";

const sqsClient = new SQSClient({ region: env.AWS_REGION });

export type EmergencyNotificationStatus = "queued" | "disabled" | "failed";

export async function queueEmergencyRequestNotification(
  request: EmergencyRequestRecord,
  requestId: string
): Promise<EmergencyNotificationStatus> {
  if (!env.EMERGENCY_REQUEST_QUEUE_URL) {
    logger.info(
      { requestId, emergencyRequestId: request.id, notificationStatus: "disabled" },
      "Emergency request queue is not configured"
    );
    return "disabled";
  }

  try {
    await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: env.EMERGENCY_REQUEST_QUEUE_URL,
        MessageBody: JSON.stringify({
          eventType: "emergency_request.submitted",
          occurredAt: new Date().toISOString(),
          request
        }),
        MessageAttributes: {
          eventType: {
            DataType: "String",
            StringValue: "emergency_request.submitted"
          },
          priority: {
            DataType: "String",
            StringValue: request.priority
          }
        }
      })
    );

    logger.info(
      { requestId, emergencyRequestId: request.id, notificationStatus: "queued" },
      "Emergency request notification queued"
    );
    return "queued";
  } catch (error) {
    logger.error(
      {
        error,
        requestId,
        emergencyRequestId: request.id,
        notificationStatus: "failed"
      },
      "Emergency request was saved but its notification could not be queued"
    );
    return "failed";
  }
}
