import { Agent } from "../base";
import config from "./config";

class AssistantAgent extends Agent {
  constructor() {
    super(config);
    this.type = "assistant";

    Object.entries(config.defaultContext).forEach(([key, value]) => {
      this.updateContext(key, value);
    });
  }

  prepareContext(message, options = {}) {
    const baseContext = super.prepareContext(message, options);

    const assistantContext = [
      "\nAssistant Context:",
      `Primary Languages: ${this.context.get("primaryLanguages").join(", ")}`,
      `Framework Knowledge: ${this.context
        .get("frameworkKnowledge")
        .join(", ")}`,
      "\nTask:",
      message,
    ].join("\n");

    return baseContext + "\n" + assistantContext;
  }

  async process(message, options = {}) {
    const assistantOptions = {
      ...options,
      temperature: 0.7,
      maxTokens: 1024,
    };

    return super.process(message, assistantOptions);
  }

  async provideInformation(query, options = {}) {
    const infoPrompt = `Please provide information on the following topic: ${query}`;
    return this.process(infoPrompt, options);
  }

  async answerQuestion(question, options = {}) {
    const questionPrompt = `Please answer the following question: ${question}`;
    return this.process(questionPrompt, options);
  }

  async provideSuggestions(topic, options = {}) {
    const suggestionPrompt = `Please provide suggestions related to: ${topic}`;
    return this.process(suggestionPrompt, options);
  }
}

export default new AssistantAgent();
