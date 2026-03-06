/**
 * Local runner for debugging the Lambda handler.
 * Launch the debugger with this file so breakpoints in src/handler.ts are hit.
 */

require("dotenv").config();

const { handler } = require("./dist/handler");

handler();
