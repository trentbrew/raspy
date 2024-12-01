import { Agent } from "../base";
import config from "./config";

class WriterAgent extends Agent {
  constructor() {
    super(config);
    this.type = "writer";

    // Initialize with default writing context
    Object.entries(config.defaultContext).forEach(([key, value]) => {
      this.updateContext(key, value);
    });
  }

  /**
   * Enhanced context preparation for writing tasks
   */
  prepareContext(message, options = {}) {
    // Get base context
    const baseContext = super.prepareContext(message, options);

    // Add writing-specific context
    const writerContext = [
      "\nWriting Context:",
      `Writing Style: ${this.context.get("writingStyle")}`,
      `Primary Genres: ${this.context.get("primaryGenres").join(", ")}`,
      `Audience: ${this.context.get("targetAudience")}`,
      "\nWriting Principles:",
      ...this.context
        .get("writingPrinciples")
        .map((principle) => `- ${principle}`),
      "\nTask:",
      message,
    ].join("\n");

    return baseContext + "\n" + writerContext;
  }

  /**
   * Process writing-related tasks with enhanced capabilities
   */
  async process(message, options = {}) {
    // Add writing-specific processing options
    const writerOptions = {
      ...options,
      temperature: 0.7, // Higher temperature for more creative writing
      maxTokens: 2048, // Higher token limit for longer text generation
    };

    return super.process(message, writerOptions);
  }

  /**
   * Review and analyze written content
   */
  async reviewContent(content, options = {}) {
    const reviewPrompt = [
      "Please review the following written content:",
      "```",
      content,
      "```",
      "\nProvide feedback on:",
      "1. Writing quality and style",
      "2. Structure and flow",
      "3. Clarity and coherence",
      "4. Engagement and impact",
      "5. Suggested improvements",
    ].join("\n");

    return this.process(reviewPrompt, options);
  }

  /**
   * Generate content outline
   */
  async generateOutline(topic, options = {}) {
    const outlinePrompt = [
      "Please generate an outline for the following topic:",
      "```",
      topic,
      "```",
      "\nInclude:",
      "1. Main sections",
      "2. Subsections",
      "3. Key points for each section",
      "4. Potential hooks or attention-grabbers",
    ].join("\n");

    return this.process(outlinePrompt, options);
  }

  /**
   * Suggest content improvements
   */
  async improveContent(content, options = {}) {
    const improvePrompt = [
      "Please suggest improvements for the following content:",
      "```",
      content,
      "```",
      "\nConsider:",
      "1. Language and word choice",
      "2. Sentence structure and variety",
      "3. Paragraph organization",
      "4. Overall narrative or argument flow",
    ].join("\n");

    return this.process(improvePrompt, options);
  }
}

export default new WriterAgent();
