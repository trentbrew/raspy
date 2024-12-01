async function probe(prompt) {
  const response = await llm.generateCompletion(prompt, {
    persona: "skeptic",
    format: "text",
  });
  return response;
}

export default probe;
