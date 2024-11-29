// Import dependencies
import 'bootstrap';
import '../scss/styles.scss';
import { processQuery } from './chat';
import { topics, changeTopic, createTopicFromModal, loadMessagesForTopic, loadTopicsFromStorage, updateUrlTopic } from './topic';

// Event Listeners
document.getElementById('message-input').addEventListener('keydown', event => {
    if (event.key === 'Enter') processQuery();
});

document.getElementById('send-btn').addEventListener('click', () => processQuery());

document.getElementById('create-topic-btn').addEventListener('click', createTopicFromModal);

document.getElementById('switch-topic-btn').addEventListener('click', () => {
    const topicName = prompt("Enter topic name to switch:");
    if (topicName && topics[topicName]) {
        changeTopic(topicName);
    } else {
        alert("Topic not found!");
    }
});

// Initialize application on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTopicsFromStorage();
    updateUrlTopic();
    loadMessagesForTopic();
});
