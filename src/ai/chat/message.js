/**
 * Represents a chat message in the system
 */
export class ChatMessage {
    constructor(content, role = 'user', timestamp = Date.now()) {
        this.content = content;
        this.role = role; // 'user', 'assistant', or 'system'
        this.timestamp = timestamp;
        this.id = `msg_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
        this.format = 'text'; // 'text', 'markdown', 'code'
        this.metadata = {}; // For additional message data like code language, formatting options
    }

    /**
     * Sets the message format and any associated metadata
     * @param {string} format - The format type ('text', 'markdown', 'code')
     * @param {Object} metadata - Additional formatting metadata
     */
    setFormat(format, metadata = {}) {
        this.format = format;
        this.metadata = { ...this.metadata, ...metadata };
        return this;
    }

    /**
     * Format the message for display
     * @returns {Object} Formatted message data
     */
    format() {
        return {
            ...this.toJSON(),
            formatted: this.formatContent()
        };
    }

    /**
     * Format the content based on message type
     * @returns {string} Formatted content
     */
    formatContent() {
        switch (this.format) {
            case 'code':
                const lang = this.metadata.language || '';
                return `\`\`\`${lang}\n${this.content}\n\`\`\``;
            case 'markdown':
                return this.content; // Already markdown formatted
            default:
                return this.content;
        }
    }

    toJSON() {
        return {
            id: this.id,
            content: this.content,
            role: this.role,
            timestamp: this.timestamp,
            format: this.format,
            metadata: this.metadata
        };
    }
}
