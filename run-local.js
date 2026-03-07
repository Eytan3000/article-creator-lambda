/**
 * Local runner for debugging the Lambda handler.
 * Launch the debugger with this file so breakpoints in src/handler.ts are hit.
 */

require("dotenv").config();

console.log("Starting local handler...");
const { handler } = require("./dist/handler");

handler()
  .then((result) => console.log("Handler result:", JSON.stringify(result, null, 2)))
  .catch((err) => console.error("Handler error:", err));
