import type { ApiItemResponse, Student3OperationalReport } from "@ddac/shared";
import { requestJson } from "./requestJson.js";

export async function getStudent3OperationalReport(): Promise<Student3OperationalReport> {
  const response = await requestJson<ApiItemResponse<Student3OperationalReport>>(
    "/api/reports/student3-operational"
  );
  return response.data;
}
