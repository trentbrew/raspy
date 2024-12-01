import llm from "../helpers/llm";
import { ChatMessage } from "./message";
import { ChatManager } from "./manager";

export { ChatMessage, ChatManager };
export default new ChatManager();

/**
 *
 * Example usage:
 *
 * import chatManager from './ai/chat';
 *
 * // Subscribe to updates
 * const unsubscribe = chatManager.subscribe((chatState) => {
 *     console.log('Chat updated:', chatState);
 * });
 *
 * // Add formatted messages
 * chatManager.addMessage("# Hello World", "user", "markdown");
 * chatManager.addMessage(
 *     "console.log('Hello')",
 *     "assistant",
 *     "code",
 *     { language: "javascript" }
 * );
 *
 * // Messages are automatically persisted
 * // and will be available after page reload
 *
 * // Clean up subscription when done
 * unsubscribe();
 *
 */
