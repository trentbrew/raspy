import { ChatMessage } from './message';
import developer from '../agents/developer';

/**
 * Manages chat conversations and message history
 */
export class ChatManager {
    constructor() {
        this.conversations = new Map();
        this.activeConversationId = null;
        this.subscribers = new Set();
        this.loadFromStorage();
    }

    /**
     * Subscribe to chat updates
     * @param {Function} callback - Function to call when updates occur
     */
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    /**
     * Notify all subscribers of updates
     */
    notifySubscribers() {
        const data = {
            conversations: Array.from(this.conversations.entries()),
            activeConversationId: this.activeConversationId
        };
        this.subscribers.forEach(callback => callback(data));
        this.saveToStorage();
    }

    /**
     * Save current state to localStorage
     */
    saveToStorage() {
        try {
            const data = {
                conversations: Array.from(this.conversations.entries()),
                activeConversationId: this.activeConversationId
            };
            localStorage.setItem('chat_state', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save chat state:', error);
        }
    }

    /**
     * Load state from localStorage
     */
    loadFromStorage() {
        try {
            const data = JSON.parse(localStorage.getItem('chat_state'));
            if (data) {
                this.conversations = new Map(data.conversations.map(([id, messages]) => [
                    id,
                    messages.map(msg => Object.assign(new ChatMessage(), msg))
                ]));
                this.activeConversationId = data.activeConversationId;
            }
        } catch (error) {
            console.error('Failed to load chat state:', error);
        }
    }

    /**
     * Creates a new conversation
     * @returns {string} The ID of the new conversation
     */
    createConversation() {
        const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.conversations.set(conversationId, []);
        this.activeConversationId = conversationId;
        this.notifySubscribers();
        return conversationId;
    }

    /**
     * Adds a message to the current conversation
     * @param {string} content - The message content
     * @param {string} role - The role of the message sender
     * @param {string} format - Message format ('text', 'markdown', 'code')
     * @param {Object} metadata - Additional message metadata
     * @returns {ChatMessage} The created message
     */
    addMessage(content, role = 'user', format = 'text', metadata = {}) {
        if (!this.activeConversationId) {
            this.createConversation();
        }

        const message = new ChatMessage(content, role);
        message.setFormat(format, metadata);
        
        const conversation = this.conversations.get(this.activeConversationId);
        conversation.push(message);
        this.notifySubscribers();
        return message;
    }

    /**
     * Gets all messages in the current conversation
     * @returns {ChatMessage[]} Array of messages
     */
    getMessages() {
        if (!this.activeConversationId) return [];
        return [...this.conversations.get(this.activeConversationId)];
    }

    /**
     * Switches to a different conversation
     * @param {string} conversationId - The ID of the conversation to switch to
     */
    switchConversation(conversationId) {
        if (this.conversations.has(conversationId)) {
            this.activeConversationId = conversationId;
            this.notifySubscribers();
        }
    }

    /**
     * Clears the current conversation
     */
    clearCurrentConversation() {
        if (this.activeConversationId) {
            this.conversations.set(this.activeConversationId, []);
            this.notifySubscribers();
        }
    }

    /**
     * Gets all conversation IDs
     * @returns {string[]} Array of conversation IDs
     */
    getConversationIds() {
        return Array.from(this.conversations.keys());
    }

    /**
     * Generate an AI response for the current conversation
     * @returns {Promise<ChatMessage>} The generated response message
     */
    async generateResponse() {
        if (!this.activeConversationId) {
            throw new Error('No active conversation');
        }

        const messages = this.getMessages();
        if (messages.length === 0) {
            throw new Error('No messages in conversation');
        }

        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === 'assistant') {
            throw new Error('Last message is already from assistant');
        }

        try {
            const response = await developer.process(lastMessage.content);
            return this.addMessage(response, 'assistant', 'markdown');
        } catch (error) {
            console.error('Failed to generate response:', error);
            throw error;
        }
    }
}
