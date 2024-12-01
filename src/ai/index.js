import { checkModelAvailability } from "./helpers/llm.js";
import daemons from "./daemons";
import agents from "./agents";

async function checkStatus() {
  return await checkModelAvailability();
}

export default {
  checkStatus,
  daemons,
  agents,
};
