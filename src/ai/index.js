import daemons from "./daemons/index.js";
import agents from "./agents/index.js";
import memory from "./memory/index.js";
import chat from "./workflows/chat/index.js";

import { checkModelAvailability } from "./helpers/llm.js";

async function checkStatus() {
  return await checkModelAvailability();
}

export default {
  checkStatus,
  daemons,
  agents,
  memory,
  chat,
};
