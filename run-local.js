/**
 * Local runner for debugging the Lambda handler.
 * Launch the debugger with this file so breakpoints in src/handler.ts are hit.
 */
const { env } = require("process");
const { handler } = require("./dist/handler");
const topic = "Why Your Backend Is Slow (And It’s Probably Not the Database)";
const mockEvent = { topic };

handler(mockEvent);
