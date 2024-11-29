# Ollama Chat - A bootstrap web app to interact with local Ollama API

This project is a simple chat application that allows users to interact with an assistant using different topics. It supports creating, switching, and deleting topics, as well as viewing and sending messages within each topic.

## Features

- **Topic Management**: Create new topics, switch between topics, and delete topics.
- **Chat Interface**: Send messages to the assistant and receive responses in real-time.
- **Persistent Storage**: Messages and topics are stored in `localStorage`, allowing users to maintain their data between sessions.
- **Streamed Responses**: Assistant responses are streamed to the UI, making the chat experience more interactive.
- **Message Formatting**: User and assistant messages are rendered with Markdown support, and HTML sanitization is applied for security.

## File Structure

```structure
/src
    |-- js/
        |-- chat.js        # Handles message creation, query processing, and assistant response
        |-- topic.js       # Manages topics, including creation, deletion, and switching
        |-- main.js        # Main entry point that initializes the app and manages events
        |-- color-modes.js # Handles color mode switching
    |-- scss/
        |-- styles.scss   # Stylesheet for the chat interface
        |-- fontawesome   # Stylesheet for the trash icon
  |-- index.html     # HTML layout for the chat interface
```

## Installation

### Prerequisites

- [Ollama](ollama.com) with [llama3.2](https://ollama.com/library/llama3.2) model
- Node.js (v16 or later)
- npm

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/nakanakaii/ollama_chat.git
   cd ollama_chat
   ```

2. (Optional) Install any necessary global tools like Sass for styling:

   ```bash
   npm install -g sass
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run Development Server:

   ```bash
   npm run dev
   ```

> You can also run the app using `npm run build` to create a production build.
> This will create a `dist` directory with the compiled files.
> Then, you can serve the `dist` directory using a static web server.

## Usage

### Starting the Chat

1. When the page loads, you will see a list of topics. The default topic is `"default"`.
2. You can click on a topic to view its associated messages or create a new topic.
3. To send a message, type in the input box and press Enter or click the "Send" button.
4. The assistant will respond to your message, and the conversation will be displayed under the topic.
5. You can create a new topic by clicking the "Create Topic" button and entering a unique name.
6. To switch topics, click on an existing topic or use the "Switch Topic" button.
7. You can delete a topic by clicking the trash icon next to it.

### API

The assistant uses a simple API to handle queries. The `processQuery` function sends a request to the API with the following details:

- **Endpoint**: `http://localhost:11434/api/chat`
- **Method**: `POST`
- **Body**:
  - `model`: The model to use (e.g., `"llama3.2"`).
  - `messages`: The current conversation history for the selected topic.
  - `stream`: Whether to stream the response.

### Customization

- The appearance of the app can be customized by editing `styles.scss`.
- You can modify the backend API URL in the `chat.js` file.

## Dependencies

- **Bootstrap**: For modal and button styling.
- **DOMPurify**: For sanitizing HTML content to prevent XSS attacks.
- **Marked**: For rendering Markdown content in messages.
- **Font Awesome**: For the trash icon in the topic list.

## Contributing

1. Fork the repository.
2. Create a new branch for your changes.
3. Make your changes and commit them with clear, descriptive messages.
4. Push your changes and open a pull request.

## License

This project is licensed under the [GNU General Public - see the [LICENSE](LICENSE) file for details.
