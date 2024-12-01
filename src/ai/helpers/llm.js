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
  try {
    const model = await window.gemini.getGenerativeModel({
      model: "gemini-nano",
    });
    return !!model;
  } catch (error) {
    console.error("Error checking model availability:", error);
    return false;
  }
}

/**
 * Creates a new session for the language model with the provided options.
 * @param {Object} options - The options for creating the session.
 * @returns {Promise<Object|string>} - A promise that resolves to the created session object or "No model available" if the model is not available.
 */
async function createSession(options) {
  const isAvailable = await checkModelAvailability();
  if (!isAvailable) return "No model available";

  try {
    const model = await window.gemini.getGenerativeModel({
      model: "gemini-nano",
    });
    const systemPrompt = await generateSystemPrompt(options);
    return { model, systemPrompt };
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
}

/**
 * Generates a completion for the given prompt using the provided options.
 * @param {string} prompt - The prompt to generate a completion for.
 * @param {Object} options - The options for generating the completion.
 * @returns {Promise<string>} - A promise that resolves to the generated completion.
 * @throws {Error} - If no model is available.
 */
async function generateCompletion(prompt, options = defaults) {
  const session = await createSession(options);
  if (session === "No model available") {
    throw new Error("No model available");
  }

  try {
    const result = await session.model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating completion:", error);
    throw error;
  }
}

export {
  checkModelAvailability,
  createSession,
  generateCompletion,
  generateSystemPrompt,
};
export default {
  checkModelAvailability,
  createSession,
  generateCompletion,
  generateSystemPrompt,
};
