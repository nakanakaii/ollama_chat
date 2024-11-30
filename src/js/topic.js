// topic.js
import { Modal } from 'bootstrap';
import { createOrUpdateAssistantMessage, createUserMessage } from './chat';

export let currentTopic = 'default';  // Default topic
export let topics = { default: [] };  // Default topic initialization

// Load topics from localStorage and initialize the current topic
export function loadTopicsFromStorage() {
    const storedTopics = localStorage.getItem('topics');
    if (storedTopics) {
        topics = JSON.parse(storedTopics);
    } else {
        saveTopicsToStorage();  // Save initial empty topics if not present
    }

    const urlParams = new URLSearchParams(window.location.search);
    currentTopic = urlParams.get('topic') || localStorage.getItem('currentTopic') || 'default';

    createTopicList();
}

// Create a list of topics dynamically
export function createTopicList() {
    const topicLists = document.querySelectorAll('#chat-list');
    topicLists.forEach(topicList => {
        topicList.innerHTML = '';  // Clear existing list items
        Object.entries(topics).forEach(([topic, data]) => {
            const button = createTopicButton(topic, data);

            // Add the "active" class to the current topic
            if (topic === currentTopic) {
                button.classList.add('active');
            }
            // Create a delete button (Font Awesome trash icon) and append it inside the topic button
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('btn', 'btn-link', 'p-0', 'ms-2', 'text-danger', 'delete-btn');
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; // Font Awesome trash icon
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();  // Prevent the topic click event
                deleteTopic(topic);
            });

            // Append delete button inside the topic button
            button.classList.add('d-flex', 'justify-content-between', 'align-items-center');
            button.appendChild(deleteButton);

            // Create a wrapper for the button and delete button
            const topicItem = document.createElement('div');
            topicItem.classList.add('d-flex', 'justify-content-between', 'align-items-center');
            topicItem.appendChild(button);

            topicList.appendChild(topicItem);
        });
    });
}

// Create a button element for each topic
function createTopicButton(topic, data) {

    const button = document.createElement('a');
    button.classList.add('list-group-item', 'list-group-item-action');

    const div = document.createElement('div');
    div.classList.add('d-flex', 'align-items-start', 'flex-column');

    const topicName = document.createElement('strong');
    topicName.innerText = topic;
    div.appendChild(topicName);

    const modelInfo = document.createElement('small');
    modelInfo.classList.add('text-muted', 'd-block');
    modelInfo.innerText = `${data.model ?? 'default'}`; // Greyed-out text
    div.appendChild(modelInfo);

    button.appendChild(div);
    button.addEventListener('click', () => changeTopic(topic));
    return button;
}

// Delete a topic
function deleteTopic(topicName) {
    if (topics[topicName]) {
        delete topics[topicName];
        saveTopicsToStorage();
        createTopicList();  // Re-render the topic list
        loadMessagesForTopic();  // Load messages for the new active topic
    }
}

// Save topics and current topic to localStorage
export function saveTopicsToStorage() {
    localStorage.setItem('topics', JSON.stringify(topics));
    localStorage.setItem('currentTopic', currentTopic);
}

// Update URL with the current topic
export function updateUrlTopic() {
    const url = new URL(window.location.href);
    url.searchParams.set('topic', currentTopic);
    window.history.pushState({}, '', url);
}

// Change the current topic
export function changeTopic(topicName) {
    if (!topics[topicName]) topics[topicName] = [];
    currentTopic = topicName;
    saveTopicsToStorage();
    updateUrlTopic();
    loadMessagesForTopic();
}

// Load and display messages for the current topic
export function loadMessagesForTopic() {
    const output = document.getElementById('output');
    output.innerHTML = '';
    const messages = topics[currentTopic].messages;

    messages.forEach(msg => {
        if (msg.role === 'user') {
            createUserMessage(msg.content, false);
        } else if (msg.role === 'assistant') {
            createOrUpdateAssistantMessage(msg.content);
        }
    });
}

// Handle topic creation from modal form
export function createTopicFromModal() {
    const topicName = document.getElementById('newTopicName').value.trim();
    const modelSelect = document.getElementById('modelSelect'); // Fetch model selection dropdown

    if (topicName && !topics[topicName]) {
        const selectedModel = modelSelect.value; // Get selected model
        topics[topicName] = { messages: [], model: selectedModel }; // Save topic with model

        changeTopic(topicName);
        createTopicList();
        const topicModal = Modal.getInstance(document.getElementById('createTopicModal'));
        topicModal.hide();
    } else {
        alert('Topic name is required and must be unique.');
    }
}
