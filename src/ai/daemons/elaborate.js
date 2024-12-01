async function elaborate(prompt) {
  const response = await llm.generateCompletion(prompt, {
    persona: "elaborator",
    format: "markdown",
    rules: ["noPrompt", "noExplanation", "noDelimiters"],
  });
  return utils.markdownToDelta(response);
}

export default elaborate;
