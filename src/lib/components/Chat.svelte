<script>
    import { onMount, onDestroy } from 'svelte';
    import chatManager from '../../ai/chat';
    import { TextFormatter } from '../utils/formatter';

    let messages = [];
    let inputMessage = '';
    let chatContainer;
    let unsubscribe;
    let isGenerating = false;

    onMount(() => {
        console.log('Chat component mounted');
        messages = chatManager.getMessages();

        unsubscribe = chatManager.subscribe((chatState) => {
            console.log('Chat state updated:', chatState);
            messages = chatManager.getMessages();
            scrollToBottom();
        });

        if (messages.length === 0) {
            console.log('Adding welcome message');
            chatManager.addMessage(
                "# Welcome to Raspy!\nTry sending messages with different formats:\n- Regular text\n- *Markdown* formatting\n- `Code blocks`",
                "assistant",
                "markdown"
            );
        }
    });

    onDestroy(() => {
        console.log('Chat component destroyed');
        if (unsubscribe) unsubscribe();
    });

    function scrollToBottom() {
        if (chatContainer) {
            setTimeout(() => {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }, 0);
        }
    }

    async function handleSubmit() {
        if (!inputMessage.trim()) return;

        console.log('Submitting message:', inputMessage);

        if (inputMessage.startsWith('```')) {
            const match = inputMessage.match(/^```(\w+)?\n([\s\S]*?)```$/);
            if (match) {
                const [_, lang, code] = match;
                chatManager.addMessage(code.trim(), 'user', 'code', { language: lang || '' });
                inputMessage = '';
                await generateResponse();
                return;
            }
        }

        const hasMarkdown = /[*#`_~-]/.test(inputMessage);
        chatManager.addMessage(
            inputMessage,
            'user',
            hasMarkdown ? 'markdown' : 'text'
        );

        inputMessage = '';
        await generateResponse();
    }

    async function generateResponse() {
        console.log('Generating agent response');
        isGenerating = true;
        try {
            await chatManager.generateResponse();
        } catch (error) {
            console.error('Error generating response:', error);
        } finally {
            isGenerating = false;
        }
    }

    function formatMessage(message) {
        return TextFormatter.format(message.content, message.format);
    }
</script>

<div class="chat-container">
    <div class="messages" bind:this={chatContainer}>
        {#each messages as message}
            <div class="message {message.role}">
                <div class="avatar">{message.role === 'user' ? '👤' : '🤖'}</div>
                <div class="content">
                    {@html formatMessage(message)}
                </div>
            </div>
        {/each}
        {#if isGenerating}
            <div class="message assistant">
                <div class="avatar">🤖</div>
                <div class="content">Generating response...</div>
            </div>
        {/if}
    </div>

    <form class="input-area" on:submit|preventDefault={handleSubmit}>
        <textarea
            bind:value={inputMessage}
            placeholder="Type a message... (Use markdown or ```code``` blocks)"
            on:keydown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                }
            }}
            disabled={isGenerating}
        />
        <button type="submit" disabled={isGenerating}>Send</button>
    </form>
</div>

<style>
    .chat-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-width: 800px;
        margin: 0 auto;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .messages {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .message {
        display: flex;
        gap: 0.5rem;
        max-width: 80%;
    }

    .message.assistant {
        align-self: flex-start;
    }

    .message.user {
        align-self: flex-end;
        flex-direction: row-reverse;
    }

    .avatar {
        font-size: 1.5rem;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .content {
        background: #f5f5f5;
        padding: 0.75rem;
        border-radius: 8px;
        line-height: 1.4;
    }

    .user .content {
        background: #007AFF;
        color: white;
    }

    .input-area {
        padding: 1rem;
        border-top: 1px solid #eee;
        display: flex;
        gap: 0.5rem;
    }

    textarea {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        resize: none;
        min-height: 40px;
        max-height: 120px;
        font-family: inherit;
    }

    button {
        padding: 0.5rem 1rem;
        background: #007AFF;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover:not(:disabled) {
        background: #0056b3;
    }

    button:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    :global(.content pre) {
        background: #2d2d2d;
        color: #fff;
        padding: 1rem;
        border-radius: 4px;
        overflow-x: auto;
        margin: 0.5rem 0;
    }

    :global(.content code) {
        font-family: monospace;
        background: rgba(0, 0, 0, 0.1);
        padding: 0.2rem 0.4rem;
        border-radius: 3px;
    }

    :global(.user .content pre) {
        background: #1a1a1a;
    }

    :global(.content h1, .content h2, .content h3) {
        margin: 0 0 0.5rem 0;
        line-height: 1.2;
    }

    :global(.content ul) {
        margin: 0.5rem 0;
        padding-left: 1.5rem;
    }

    :global(.content li) {
        margin: 0.25rem 0;
    }

    :global(.user .content code) {
        background: rgba(255, 255, 255, 0.2);
    }
</style>
