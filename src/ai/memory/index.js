import store from "store";
import daemons from "../daemons";

/**
 * Stores a new memory for the current user
 * @param {string} content - The content of the memory
 * @returns {Promise<Object>} The created memory record
 */
async function save(content) {
  console.log("saving memory: ", memory);
  const memory = store.set("memory", { content });
  return memory;
}

/**
 * Retrieves memories for the current user
 * @returns {Promise<Object[]>} The memories
 */
async function get(user_id) {
  const memories = await pb.get("memories", user_id);
  console.log("memories: ", memories);
  return memories;
}

/**
 * Synthesizes a memory object into its content
 * @param {Object[]} memories - The memory objects to synthesize
 * @returns {string} The content of the memory
 */
async function synthesize(memories) {
  const content = memories.map((memory) => memory.content).join("\n\n---\n\n");
  const summary = await daemons.summarize(content);
  return summary;
}

/**
 * Queries the memory store for relevant memories
 * @param {string} queryPrompt - The prompt to query the memory store with
 * @returns {Promise<Object[]>} The relevant memories
 */
async function recall(user_id) {
  const memories = await get(user_id);
  const summary = await synthesize(memories);
  return summary;
}

export default {
  save,
  get,
  synthesize,
  recall,
};
