// Import dependencies
import 'bootstrap';
import '../scss/styles.scss';
import { processQuery } from './chat';
import { createTopicFromModal, loadMessagesForTopic, loadTopicsFromStorage, updateUrlTopic } from './topic';

async function fetchModels() {
    try {
        const response = await fetch('http://localhost:11434/api/tags');
        const data = await response.json();
        console.log('Fetched models:', data.models);
        return data.models;
    } catch (error) {
        console.error('Error fetching models:', error);
        return [];
    }
}

// Event Listeners
document.getElementById('message-input').addEventListener('keydown', event => {
    if (event.key === 'Enter') processQuery();
});

document.getElementById('send-btn').addEventListener('click', () => processQuery());

document.getElementById('create-topic-btn').addEventListener('click', createTopicFromModal);

// Initialize application on page load
document.addEventListener('DOMContentLoaded', async () => {
    const models = await fetchModels();
    const modelSelect = document.getElementById('modelSelect');

    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.model;
        option.textContent = model.name;
        modelSelect.appendChild(option);
    });

    loadTopicsFromStorage();
    updateUrlTopic();
    loadMessagesForTopic();
});
