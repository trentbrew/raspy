import { Agent } from "../base";
import config from "./config";

class DesignerAgent extends Agent {
  constructor() {
    super(config);
    this.type = "designer";

    // Initialize with default design context
    Object.entries(config.defaultContext).forEach(([key, value]) => {
      this.updateContext(key, value);
    });
  }

  /**
   * Enhanced context preparation for design tasks
   */
  prepareContext(message, options = {}) {
    const baseContext = super.prepareContext(message, options);

    const designContext = [
      "\nDesign Context:",
      `Design Philosophy: ${this.context.get("designPhilosophy")}`,
      `Primary Technologies: ${this.context
        .get("primaryTechnologies")
        .join(", ")}`,
      `Domain Knowledge: ${this.context.get("domainKnowledge").join(", ")}`,
      "\nDesign Principles:",
      ...this.context
        .get("designPrinciples")
        .map((principle) => `- ${principle}`),
      "\nTask:",
      message,
    ].join("\n");

    return baseContext + "\n" + designContext;
  }

  /**
   * Process design-related tasks with enhanced capabilities
   */
  async process(message, options = {}) {
    const designOptions = {
      ...options,
      temperature: 0.7, // Higher temperature for more creative outputs
      maxTokens: 2048, // Higher token limit for detailed design descriptions
    };

    return super.process(message, designOptions);
  }

  /**
   * Create SVG based on description
   */
  async createSVG(description, options = {}) {
    const svgPrompt = [
      "Please create an SVG based on the following description:",
      "```",
      description,
      "```",
      "\nProvide the SVG code with:",
      "1. Appropriate viewBox and dimensions",
      "2. Optimized paths and shapes",
      "3. Semantic class names or IDs",
      "4. Inline styles or separate <style> tag if necessary",
    ].join("\n");

    return this.process(svgPrompt, options);
  }

  /**
   * Suggest color palette
   */
  async suggestColorPalette(requirements, options = {}) {
    const palettePrompt = [
      "Please suggest a color palette based on the following requirements:",
      "```",
      requirements,
      "```",
      "\nInclude:",
      "1. Primary, secondary, and accent colors",
      "2. Hex codes for each color",
      "3. Brief explanation of color harmony and psychology",
      "4. Accessibility considerations",
    ].join("\n");

    return this.process(palettePrompt, options);
  }

  /**
   * Provide layout recommendations
   */
  async recommendLayout(content, options = {}) {
    const layoutPrompt = [
      "Please provide layout recommendations for the following content:",
      "```",
      content,
      "```",
      "\nConsider:",
      "1. Visual hierarchy and flow",
      "2. Responsive design principles",
      "3. Whitespace utilization",
      "4. Alignment and grid system",
    ].join("\n");

    return this.process(layoutPrompt, options);
  }
}

export default new DesignerAgent();
