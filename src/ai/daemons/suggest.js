async function suggest(prompt) {
  const response = await llm.generateCompletion(prompt, {
    persona: "suggestor",
    format: "text",
    maxTokens: 10,
  });
  return response;
}

export default suggest;
