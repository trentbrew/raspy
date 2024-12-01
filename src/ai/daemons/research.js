async function research(query) {
  const result = await api.research(query);
  if (result.object === "chat.completion") {
    const { choices } = result;
    const { message } = choices[0];
    const { content } = message;
    return {
      result: content,
      citations: result.citations,
    };
  } else {
    throw new Error("Unexpected response format");
  }
}

export default research;
