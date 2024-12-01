import { Agent } from '../base';
import config from './config';

class DeveloperAgent extends Agent {
  constructor() {
    super(config);
    this.type = 'developer';
    
    // Initialize with default development context
    Object.entries(config.defaultContext).forEach(([key, value]) => {
      this.updateContext(key, value);
    });
  }

  /**
   * Enhanced context preparation for development tasks
   */
  prepareContext(message, options = {}) {
    // Get base context
    const baseContext = super.prepareContext(message, options);

    // Add development-specific context
    const devContext = [
      '\nDevelopment Context:',
      `Code Style: ${this.context.get('codeStyle')}`,
      `Primary Languages: ${this.context.get('primaryLanguages').join(', ')}`,
      `Framework Knowledge: ${this.context.get('frameworkKnowledge').join(', ')}`,
      '\nBest Practices:',
      ...this.context.get('bestPractices').map(practice => `- ${practice}`),
      '\nTask:',
      message
    ].join('\n');

    return baseContext + '\n' + devContext;
  }

  /**
   * Process code-related tasks with enhanced capabilities
   */
  async process(message, options = {}) {
    // Add code-specific processing options
    const codeOptions = {
      ...options,
      temperature: 0.3, // Lower temperature for more precise code generation
      maxTokens: 2048, // Higher token limit for code blocks
    };

    return super.process(message, codeOptions);
  }

  /**
   * Review and analyze code
   */
  async reviewCode(code, options = {}) {
    const reviewPrompt = [
      'Please review the following code:',
      '```',
      code,
      '```',
      '\nProvide feedback on:',
      '1. Code quality and best practices',
      '2. Potential bugs or issues',
      '3. Performance considerations',
      '4. Security implications',
      '5. Suggested improvements'
    ].join('\n');

    return this.process(reviewPrompt, options);
  }

  /**
   * Generate test cases for code
   */
  async generateTests(code, options = {}) {
    const testPrompt = [
      'Please generate test cases for the following code:',
      '```',
      code,
      '```',
      '\nInclude:',
      '1. Unit tests for core functionality',
      '2. Edge case tests',
      '3. Error handling tests',
      '4. Integration test considerations'
    ].join('\n');

    return this.process(testPrompt, options);
  }

  /**
   * Suggest code optimizations
   */
  async optimizeCode(code, options = {}) {
    const optimizePrompt = [
      'Please suggest optimizations for the following code:',
      '```',
      code,
      '```',
      '\nConsider:',
      '1. Performance improvements',
      '2. Code readability',
      '3. Memory usage',
      '4. Best practices'
    ].join('\n');

    return this.process(optimizePrompt, options);
  }
}

export default new DeveloperAgent();