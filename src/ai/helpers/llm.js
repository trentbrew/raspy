import personas from "../config/personas";
import defaults from "../config/defaults";
import utils from "./utils";

/**
 * Generates the system prompt for the language model based on the provided options.
 * @param {Object} options - The options for generating the system prompt.
 * @returns {Promise<string>} - A promise that resolves to the generated system prompt.
 */
async function generateSystemPrompt(options) {
  console.log("generating system prompt...");
  // TODO: add context about the user and the project
  const systemPrompt = personas[options.persona](options);
  console.log(systemPrompt);
  return systemPrompt;
}

/**
 * Checks the availability of the language model.
 * @returns {Promise<boolean>} - A promise that resolves to true if the model is readily available, false otherwise.
 */
async function checkModelAvailability() {
  const { available } = await ai.languageModel?.capabilities();
  if (!available) console.error("❌ Model not available");
  else console.log("🟢 Model available");
  return available === "readily";
}

/**
 * Creates a new session for the language model with the provided options.
 * @param {Object} options - The options for creating the session.
 * @returns {Promise<Object|string>} - A promise that resolves to the created session object or "No model available" if the model is not available.
 */
async function createSession(options) {
  if (await checkModelAvailability()) {
    console.log("Model available. Generating session...");
    console.log(defaults);
    const session = await ai.languageModel.create({
      systemPrompt: await generateSystemPrompt(options),
      maxTokens: options.maxTokens || defaults.maxTokens,
      temperature: options.temperature || defaults.temperature,
      topK: options.topK || defaults.topK,
    });
    console.log("Session created");
    return session;
  }
  return "No model available";
}

/**
 * Generates a completion for the given prompt using the provided options.
 * @param {string} prompt - The prompt to generate a completion for.
 * @param {Object} options - The options for generating the completion.
 * @returns {Promise<string>} - A promise that resolves to the generated completion.
 * @throws {Error} - If no model is available.
 */
async function generateCompletion(prompt, options = defaults) {
  try {
    const session = await createSession(options);
    if (session === "No model available") throw new Error("No model available");
    console.log("Generating completion...");
    const result = await session.prompt(prompt);
    console.log("result: ", result);
    return result;
  } catch (error) {
    console.error("Error generating completion:", error);
    throw error;
  }
}

export default { checkModelAvailability, createSession, generateCompletion };
