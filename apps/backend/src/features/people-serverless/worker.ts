import { env } from "../../config/env.js";

type SqsRecord = { messageId: string; body: string };
type SqsEvent = { Records: SqsRecord[] };

export async function handler(event: SqsEvent, context: { awsRequestId: string }): Promise<{ batchItemFailures: { itemIdentifier: string }[] }> {
  const batchItemFailures: { itemIdentifier: string }[] = [];

  for (const record of event.Records) {
    try {
      if (env.SIMULATE_EVENT_PROCESSING_FAILURE) {
        throw new Error("Event-processing failure was requested for DLQ demonstration.");
      }

      const notification = JSON.parse(record.body) as { Message?: string };
      console.info(JSON.stringify({ service: env.SERVERLESS_SERVICE_NAME, requestId: context.awsRequestId, event: "assistance_event_processed", message: notification.Message ?? record.body }));
    } catch (error) {
      console.error(JSON.stringify({ service: env.SERVERLESS_SERVICE_NAME, requestId: context.awsRequestId, event: "assistance_event_processing_failed", messageId: record.messageId, error }));
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }

  return { batchItemFailures };
}
