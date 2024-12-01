async function devilsAdvocate(prompt) {
  const response = await llm.generateCompletion(prompt, {
    persona: "contrarian",
    format: "text",
  });
  return response;
}

export default devilsAdvocate;
