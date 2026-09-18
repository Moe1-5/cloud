import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import type { AuthTokenPayload } from "../auth/token.js";
import type { VictimRecord } from "@ddac/shared";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors.js";

const snsClient = new SNSClient({ region: env.AWS_REGION });

type AssistanceEventInput = {
  victim: VictimRecord;
  actor: AuthTokenPayload;
  requestId: string;
};

export async function publishAssistanceRecorded(input: AssistanceEventInput): Promise<void> {
  if (!env.VICTIM_VOLUNTEER_EVENTS_TOPIC_ARN) {
    return;
  }

  try {
    await snsClient.send(
      new PublishCommand({
        TopicArn: env.VICTIM_VOLUNTEER_EVENTS_TOPIC_ARN,
        MessageAttributes: {
          eventType: { DataType: "String", StringValue: "VictimAssistanceRecorded" },
          requestId: { DataType: "String", StringValue: input.requestId }
        },
        Message: JSON.stringify({
          eventType: "VictimAssistanceRecorded",
          occurredAt: new Date().toISOString(),
          requestId: input.requestId,
          actor: { id: input.actor.sub, role: input.actor.role },
          victimId: input.victim.id,
          assistance: input.victim.assistanceHistory[0]
        })
      })
    );
  } catch (error) {
    console.error(JSON.stringify({ event: "assistance_event_publish_failed", requestId: input.requestId, error }));
    throw new AppError("Assistance was recorded but its notification event could not be published.", 502);
  }
}
