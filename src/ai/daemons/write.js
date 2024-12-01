async function write(prompt) {
  const response = await llm.generateCompletion(prompt, {
    persona: "writer",
    format: "markdown",
    rules: ["noDelimiters", "noPrompt", "noExplanation"],
    tones: ["neutral"], // TODO: pass this as a parameter
    maxTokens: 1600,
    temperature: 0.9,
  });
  // utils.saveToLogs(response)
  console.log(response);
  return utils.markdownToDelta(response);
}

export default write;
