# i_draw_ai_guess Project Overview

This project is a web-based "I Draw, AI Guess" game built with Python (Flask) for the backend and HTML/CSS/JavaScript for the frontend. It uses any OpenAI-compatible multimodal model API to recognize hand-drawn sketches.

## Core Functionality

1.  **Drawing Canvas:** Users can draw on an HTML5 canvas using various tools (brush, eraser, dotted line), colors, and brush sizes.
2.  **AI Recognition:** The drawn image is sent to the configured multimodal API, which attempts to identify the object depicted.
3.  **Game Modes:**
    *   **Free Mode:** Draw anything and see what the AI guesses.
    *   **Guess Mode:** Draw a specific target word provided by the game.
4.  **Feedback System:** Users can provide feedback on the AI's guess (Satisfied/Unsatisfied/Skip in Free Mode, or Correct/Incorrect in Guess Mode).
5.  **Game Statistics:** Tracks total guesses, correct guesses, and win rate, with visual "levels" (Bronze to Diamond) based on performance.
6.  **History:** Stores previous drawings and AI guesses in a local SQLite database (`game_history.db`) and displays them in the UI. Users can view enlarged images or delete history entries.
7.  **Image Upload:** Allows users to upload an existing image for the AI to recognize.

## Technologies Used

*   **Backend:** Python, Flask
*   **Frontend:** HTML5, CSS3 (with cyberpunk styling), JavaScript (ES6)
*   **AI Model:** Any OpenAI-compatible multimodal model API
*   **Database:** SQLite
*   **Authentication:** API key (loaded from environment variables)
*   **External Libraries:** `openai` Python library (used for API interaction), `python-dotenv`

## Project Structure

*   `app.py`: Main Flask application file. Handles API endpoints for AI guessing (`/guess`), retrieving history (`/history`), clearing history (`/clear_history`), deleting records (`/delete_history/<id>`), and serving static files.
*   `config.py`: Loads configuration from a `.env` file (API URL, key, model name).
*   `requirements.txt`: Lists Python dependencies (Flask, openai, python-dotenv).
*   `index.html`: Main HTML file for the frontend application.
*   `style.css`: Contains all the styling, including a cyberpunk theme with responsive design.
*   `script.js`: Contains all client-side JavaScript logic for canvas drawing, UI interaction, API communication, game modes, stats, and history management.
*   `.env.example`: Example environment file showing required variables (BASE_URL, API_KEY, MODEL).

## Setup and Running

1.  **Prerequisites:**
    *   Python 3.x installed.
    *   An API key for an OpenAI-compatible multimodal model service.
2.  **Installation:**
    *   Create a virtual environment: `python -m venv venv`
    *   Activate it:
        *   Windows: `venv\Scripts\activate`
        *   macOS/Linux: `source venv/bin/activate`
    *   Install dependencies: `pip install -r requirements.txt`
3.  **Configuration:**
    *   Copy `.env.example` to `.env`.
    *   Edit `.env` and fill in your API `BASE_URL`, `API_KEY`, and `MODEL` name.
4.  **Running:**
    *   Execute the Flask application: `python app.py`
    *   Open a web browser and navigate to `http://127.0.0.1:5000`.

## Development Notes

*   The frontend uses a cyberpunk aesthetic with glowing effects, custom cursors, and animations.
*   The drawing canvas supports multiple tools and responsive resizing.
*   Game statistics are persisted in the browser's `localStorage`.
*   History is stored server-side in SQLite and loaded on page load.
*   The AI prompt in `app.py` strictly defines the recognition rules for the model.