/**
 * Local entry point for debugging. Invokes the Lambda handler so breakpoints are hit.
 * Run: node dist/run-local.js (or use the "Launch Program" debug config).
 */
import type { APIGatewayProxyResult } from "aws-lambda";
import { handler } from "./index.js";

const event = {} as Parameters<typeof handler>[0];
const context = {} as Parameters<typeof handler>[1];

Promise.resolve(handler(event, context, () => {}))
  .then((res: void | APIGatewayProxyResult) => {
    if (res) console.log("Response:", JSON.stringify(res, null, 2));
  })
  .catch((err: unknown) => console.error("Error:", err));
