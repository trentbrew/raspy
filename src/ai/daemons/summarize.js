async function summarize(prompt) {
  const response = await llm.generateCompletion(prompt, {
    persona: "synthesizer",
    format: "markdown",
    rules: ["noPrompt", "noExplanation", "noDelimiters"],
  });
  return utils.markdownToDelta(response);
}

export default summarize;
