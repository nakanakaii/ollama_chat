// chat.js
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { currentTopic, saveTopicsToStorage, topics } from './topic';

// Create and append a user message
export function createUserMessage(message, saveToStorage = true) {
    const element = document.createElement('div');
    element.classList.add('user-message');
    element.innerHTML = DOMPurify.sanitize(marked.parse(message));
    document.getElementById('output').appendChild(element);
    element.scrollIntoView({ behavior: 'smooth' });

    if (saveToStorage) {
        topics[currentTopic].push({ role: 'user', content: message });
        saveTopicsToStorage();
    }
}

// Create or update an assistant message
export function createOrUpdateAssistantMessage(content, outputId = null) {
    let element = outputId ? document.getElementById(outputId) : null;

    if (!element) {
        element = document.createElement('div');
        element.classList.add('assistant-message');
        element.id = outputId || `assistant-response-${Date.now()}`;
        document.getElementById('output').appendChild(element);
    }

    element.innerHTML = DOMPurify.sanitize(marked.parse(content));
    element.scrollIntoView({ behavior: 'smooth' });

    return element;
}

// Handle the query processing (sending and receiving messages)
export function processQuery() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (!message) return;

    messageInput.value = '';
    createUserMessage(message);

    const outputId = `assistant-response-${Date.now()}`;
    let output = '';

    fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "llama3.2",
            messages: topics[currentTopic],
            stream: true,
        }),
    })
        .then(response => handleStreamResponse(response, outputId, output))
        .catch(error => console.error("Error in fetch:", error));
}

// Handle streamed response from the assistant
function handleStreamResponse(response, outputId, output) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    function processStream({ done, value }) {
        if (done) {
            if (output.trim()) {
                topics[currentTopic].push({ role: 'assistant', content: output });
                saveTopicsToStorage();
            }
            return;
        }

        const chunkText = decoder.decode(value, { stream: true });
        const lines = chunkText.split('\n').filter(line => line.trim() !== '');

        lines.forEach(line => {
            try {
                const json = JSON.parse(line);
                if (json.message?.content) {
                    output += json.message.content;
                    createOrUpdateAssistantMessage(output, outputId);
                }
            } catch (error) {
                console.error("Error parsing stream response:", error);
            }
        });

        reader.read().then(processStream);
    }

    reader.read().then(processStream);
}
