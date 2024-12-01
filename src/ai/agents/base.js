import { generateCompletion } from '../helpers/llm';
import chatManager from '../chat';
import { createLocalAIVectorDB } from '../../db/vdb';

/**
 * Base Agent class that all specialized agents inherit from
 */
export class Agent {
  constructor(config = {}) {
    this.type = 'base';
    this.name = config.name || 'Agent';
    this.description = config.description || 'A general-purpose AI agent';
    this.capabilities = config.capabilities || [];
    this.context = new Map();
    this.isProcessing = false;
    this.vdb = null;
  }

  /**
   * Initialize the agent with any required setup
   */
  async init() {
    try {
      this.vdb = createLocalAIVectorDB();
      return true;
    } catch (error) {
      console.error(`Failed to initialize ${this.name}:`, error);
      return false;
    }
  }

  /**
   * Process a user message and generate a response
   */
  async process(message, options = {}) {
    if (this.isProcessing) {
      throw new Error('Agent is already processing a message');
    }

    this.isProcessing = true;
    try {
      // Add message to chat
      chatManager.addMessage(message, 'user');

      // Prepare context for the model
      const context = await this.prepareContext(message, options);
      
      // Generate response using the LLM
      const response = await generateCompletion(context, {
        ...options,
        persona: this.type
      });

      // Add response to chat
      chatManager.addMessage(response, 'assistant');

      // Memorize the interaction if it seems important
      await this.memorizeIfRelevant(message, response);

      return response;
    } catch (error) {
      console.error(`${this.name} failed to process message:`, error);
      throw error;
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Prepare context for the model based on message and agent state
   */
  async prepareContext(message, options = {}) {
    // Recall relevant memories
    const memories = await this.recall(message);
    const relevantMemories = memories.length > 0 
      ? '\nRelevant Context:\n' + memories.map(m => `- ${m.content}`).join('\n')
      : '';

    const context = [
      `You are ${this.name}, ${this.description}`,
      `Your capabilities include: ${this.capabilities.join(', ')}`,
      relevantMemories,
      'Current conversation:',
      ...chatManager.getMessages().map(msg => `${msg.role}: ${msg.content}`),
      `User: ${message}`
    ].join('\n');

    return context;
  }

  /**
   * Update agent's context with new information
   */
  updateContext(key, value) {
    this.context.set(key, value);
  }

  /**
   * Clear agent's context
   */
  clearContext() {
    this.context.clear();
  }

  /**
   * Remember information in agent's memory
   */
  async remember(content, metadata = {}) {
    if (!this.vdb) await this.init();
    
    return this.vdb.memorize({
      content,
      category: this.type,
      metadata: {
        ...metadata,
        timestamp: Date.now(),
        agentType: this.type
      }
    });
  }

  /**
   * Recall information from agent's memory
   */
  async recall(query, options = {}) {
    if (!this.vdb) await this.init();

    return this.vdb.recall({
      query,
      category: this.type,
      ...options
    });
  }

  /**
   * Memorize interaction if it seems important
   */
  async memorizeIfRelevant(userMessage, agentResponse) {
    // Simple heuristic: memorize if the message contains questions, commands,
    // or specific keywords indicating importance
    const shouldMemorize = 
      userMessage.includes('?') ||
      userMessage.toLowerCase().includes('remember') ||
      userMessage.toLowerCase().includes('important') ||
      userMessage.toLowerCase().includes('note');

    if (shouldMemorize) {
      await this.remember(`User asked: ${userMessage}\nResponse: ${agentResponse}`, {
        type: 'interaction',
        importance: 'high'
      });
    }
  }
}
