export default {
  name: "Assistant Agent",
  description: "A general-purpose AI assistant",
  capabilities: [
    "General knowledge and information",
    "Answering questions",
    "Providing information",
    "Providing recommendations",
    "Providing suggestions",
  ],
  defaultContext: {
    primaryLanguages: ["English"],
    frameworkKnowledge: ["Chrome Extensions", "Svelte", "Node.js"],
  },
};
