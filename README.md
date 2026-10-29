# Ghostlight — Ghost in the Machine

**Ghostlight** is a spooky story generator created for the **Ghost in the Machine** open-source AI challenge. Give it a story seed, choose an atmosphere, and generate an original tale with either a locally hosted open-weight model or a built-in offline story engine.

## Features

- **Local open-weight AI:** Connects to [Ollama](https://ollama.com/) through its local HTTP API. The app does not require a hosted AI API key.
- **Offline fallback:** The built-in story engine works without Ollama or an internet connection.
- **Privacy-minded:** When using Ollama, the prompt is sent to the Ollama service on your own computer, not to a cloud AI provider by this app.
- **Customisable stories:** Choose a prompt, mood, and story length.
- **Copy story:** Copy generated output to share or save it.
- **Responsive interface:** Works on desktop and mobile browsers.

## Project files

```text
ghost_in_the_machine/
├── index.html    # App structure and controls
├── style.css     # Visual design and responsive layout
├── script.js     # Ollama integration and offline story engine
└── README.md     # Setup and project documentation
```

## Run the app

### Option A — Offline mode (quickest)

1. Download or clone this project.
2. Open `index.html` in a modern browser.
3. Select **Offline story engine (no model needed)**.
4. Enter a prompt and click **Summon a story**.

The offline engine is template-based, not a generative language model. It is included so the project remains usable without a model or network connection.

### Option B — Run with open-weight AI locally using Ollama

1. Install Ollama from [ollama.com](https://ollama.com/).
2. Open a terminal and download a model. For example:

   ```bash
   ollama pull llama3.2
   ```

3. Make sure Ollama is running, then start this project with a local development server rather than opening the HTML file directly. In VS Code, install **Live Server**, right-click `index.html`, and choose **Open with Live Server**.
4. If your browser blocks the request because of CORS, configure Ollama's allowed origins for your local server and restart Ollama. For example, for Live Server on port 5500, allow `http://127.0.0.1:5500` and `http://localhost:5500`. See the official [Ollama documentation](https://github.com/ollama/ollama/blob/main/docs/faq.md) for the current environment-variable instructions for your operating system.
5. In Ghostlight, select **Local open-weight AI (Ollama)** and enter the model name, such as `llama3.2`.
6. Enter a story seed and click **Summon a story**.

The browser app calls `http://localhost:11434/api/chat`. If Ollama cannot find the selected model, run `ollama pull <model-name>` in your terminal.

> **Note:** The Ollama option needs Ollama and a downloaded model. The browser sends prompts to the local Ollama service. No remote AI API is configured in this project. Ollama setup and model downloads may require internet access initially; once installed and downloaded, local inference can run offline.

## How it works

1. The user chooses a story seed, atmosphere, length, and engine.
2. If **Local open-weight AI** is selected, `script.js` sends a chat request to the local Ollama API with a system prompt describing the desired story.
3. Ollama runs the selected model locally and returns generated text.
4. If **Offline story engine** is selected, JavaScript assembles a short atmospheric story from local templates without making any network requests.
5. The result appears in the story panel and can be copied.

## Why open innovation matters

Ghost stories are personal, playful, and sometimes connected to memories people may prefer to keep private. A local open-weight model gives users more control over where prompts are processed. It also makes the model replaceable: users can try another Ollama-compatible model by changing the model name, inspect the integration, and modify the prompt or behaviour without depending on a proprietary hosted AI endpoint.

The offline fallback also keeps the interface accessible when no model is installed. This is a useful distinction: the fallback is not itself an AI model, while the Ollama mode is the open-weight AI path.

## Limitations

- The app does not save story history to a database. Copy a story if you want to keep it.
- The offline fallback uses templates and random selection; it is not equivalent to an LLM.
- Local model speed and quality depend on your computer and the model you download.
- The Ollama option requires the local service to be running and the browser to permit the local request.
- This is a creative storytelling demo, not a tool for contacting real spirits or verifying supernatural claims.

## Built with

- HTML
- CSS
- Vanilla JavaScript
- [Ollama](https://ollama.com/) local API (optional open-weight model runtime)

## Suggested demo

1. Open the app and show the responsive interface.
2. Generate a story using the offline engine to demonstrate the no-model fallback.
3. Start Ollama, select a downloaded open-weight model, and generate a second story from the same seed.
4. Explain the difference between the local LLM path and the template-based fallback.
5. Highlight privacy, model choice, and the ability to customise the prompt.

## License

MIT — you may use, modify, and distribute this project. If publishing it publicly, add a `LICENSE` file containing the standard MIT license text and your copyright notice.
