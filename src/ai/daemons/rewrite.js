async function rewrite(prompt) {
  const response = await llm.generateCompletion(prompt, {
    persona: "rewriter",
    format: "markdown",
    rules: ["noExplanation"],
  });
  return utils.markdownToDelta(response);
}

export default rewrite;
