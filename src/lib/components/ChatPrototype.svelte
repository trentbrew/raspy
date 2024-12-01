<script>
    import { onMount, onDestroy } from 'svelte';

    let messages = [];
    let inputMessage = '';
    let chatContainer;
    let session = null;
    let isGenerating = false;
    let modelStatus = 'Checking model availability...';

    onMount(async () => {
        try {
            const { available } = await ai.languageModel.capabilities();
            if (available === 'readily') {
                modelStatus = 'Model ready';
                session = await ai.languageModel.create({
                    systemPrompt: "You are a helpful AI assistant."
                });
            } else {
                modelStatus = `Model not available (status: ${available})`;
            }
        } catch (error) {
            modelStatus = `Error: ${error.message}`;
            console.error('AI initialization error:', error);
        }
    });

    onDestroy(() => {
        if (session) {
            session.destroy();
        }
    });

    function scrollToBottom() {
        if (chatContainer) {
            setTimeout(() => {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }, 0);
        }
    }

    async function handleSubmit() {
        if (!inputMessage.trim() || !session || isGenerating) return;

        try {
            isGenerating = true;

            // Add user message
            messages = [...messages, { role: 'user', content: inputMessage }];
            const userMessage = inputMessage;
            inputMessage = '';
            scrollToBottom();

            // Get AI response
            const stream = session.promptStreaming(userMessage);
            let aiResponse = '';
            let previousChunk = '';

            // Add AI message placeholder
            messages = [...messages, { role: 'assistant', content: '' }];

            for await (const chunk of stream) {
                // Handle streaming chunks
                const newChunk = chunk.startsWith(previousChunk)
                    ? chunk.slice(previousChunk.length)
                    : chunk;

                aiResponse += newChunk;
                previousChunk = chunk;

                // Update the last message with current response
                messages[messages.length - 1].content = aiResponse;
                messages = messages; // Trigger Svelte reactivity
                scrollToBottom();
            }

        } catch (error) {
            console.error('Chat error:', error);
            messages = [...messages, {
                role: 'system',
                content: `Error: ${error.message}`
            }];
        } finally {
            isGenerating = false;
            scrollToBottom();
        }
    }
</script>

<div class="chat-container">
    <div class="status-bar">
        {modelStatus}
    </div>

    <div class="messages" bind:this={chatContainer}>
        {#each messages as message}
            <div class="message {message.role}">
                <div class="avatar">
                    {#if message.role === 'user'}
                        👤
                    {:else if message.role === 'assistant'}
                        🤖
                    {:else}
                        ⚠️
                    {/if}
                </div>
                <div class="content">
                    {message.content}
                </div>
            </div>
        {/each}
        {#if isGenerating}
            <div class="message system">
                <div class="avatar">⌛</div>
                <div class="content">Generating response...</div>
            </div>
        {/if}
    </div>

    <form class="input-area" on:submit|preventDefault={handleSubmit}>
        <textarea
            bind:value={inputMessage}
            placeholder="Type a message..."
            on:keydown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                }
            }}
            disabled={isGenerating || !session}
        />
        <button type="submit" disabled={isGenerating || !session}>
            Send
        </button>
    </form>
</div>

<style>
    .chat-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-width: 400px;
        margin: 0 auto;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .status-bar {
        padding: 8px;
        background: #f5f5f5;
        border-bottom: 1px solid #ddd;
        font-size: 0.9em;
        color: #666;
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

    .message.system {
        align-self: center;
        font-style: italic;
        color: #666;
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
        white-space: pre-wrap;
    }

    .user .content {
        background: #007AFF;
        color: white;
    }

    .system .content {
        background: #fff3cd;
        color: #856404;
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

    textarea:disabled {
        background: #f5f5f5;
        cursor: not-allowed;
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
</style>
