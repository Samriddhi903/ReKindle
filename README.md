Try out our app here: https://imaginative-lolly-29ba25.netlify.app/
Checkout our demo video: https://youtu.be/P4cEUzymtBw
# ReKindle
![image](https://github.com/user-attachments/assets/882cc4db-5fac-4e9f-8465-39dcb801b964)

**ReKindle** is a web application designed to help neurodivergent children and families to connect, learn, and have fun through interactive games, bedtime stories, reminders, and a safe online community. The project features AI-powered voice narration, accessible design, and a variety of engaging activities.

---

## Features

- 🎮 **Mini-Games:** Educational and fun games for kids.
 <img width="1901" height="909" alt="image" src="https://github.com/user-attachments/assets/13a712f7-306b-4a64-855b-4e189c9dae14" />

- 📖 **Story Time:** Listen to bedtime stories, narrated by AI voice (OmniDimension integration).
  
- ⏰ **Reminders:** Set and view reminders for daily tasks.
- 🗣️ **Community:** Create and interact with posts in a safe, moderated environment.
<img width="1584" height="892" alt="image" src="https://github.com/user-attachments/assets/76d63b06-42c3-4820-bf55-84a668be749f" />


- 🤖 **AI Integration:** Chatbot and voice narration powered by OmniDimension.
 <img width="1619" height="921" alt="image" src="https://github.com/user-attachments/assets/8144dee7-74d0-4aba-b192-880d95df89a7" />

- ♿ **Accessibility:** Dyslexia-friendly fonts, large buttons, and clear color schemes.

---

## Project Structure

```
re-kindle/
  ├── rekindle-backend/      # Node.js backend (API, models)
  └── rekindle-frontend/     # React frontend (UI, games, community)
```

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/re-kindle.git
cd re-kindle
```

---

### 2. Setup the Backend

```bash
cd rekindle-backend
npm install
# or
yarn install
```

- Configure your environment variables (e.g., database URI, JWT secret) as needed.
- Start the backend server:
  ```bash
  npm start
  # or
  yarn start
  ```

---

### 3. Setup the Frontend

```bash
cd ../rekindle-frontend
npm install
# or
yarn install
```

- Create a `.env` file if you need to set environment variables (e.g., OmniDimension API keys).
- Start the frontend development server:
  ```bash
  npm run dev
  # or
  yarn dev
  ```

---

### 4. Access the App

- Open your browser and go to: [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## Usage

- **Games:** Navigate to the Games section to play mini-games.
- **Story Time:** Select a story and click Play to listen to AI-narrated bedtime stories.
- **Reminders:** Add, view, and manage reminders.
- **Community:** Create posts, comment, and interact with others in a safe space.
- **AI Chatbot:** Use the embedded chatbot for help or fun conversations.

---

## OmniDimension Voice AI Integration

- The app integrates with OmniDimension for AI voice narration of stories.
- Configure your OmniDimension API key in the frontend `.env` file:
  ```
  VITE_OMNIDIMENSION_SECRET_KEY=your_secret_key_here
  ```
- The voice AI is used in the Story Time section and for the chatbot widget.

---

## Accessibility

- Uses OpenDyslexic and Lexend fonts for readability.
- Large, high-contrast buttons and text.
- Responsive design for all devices.

---

## Folder Structure

- **rekindle-frontend/src/components/**: React components for games, community, reminders, and more.
- **rekindle-backend/models/**: Mongoose models for users, messages, reminders, etc.
- **rekindle-backend/server.js**: Main backend server file.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## Acknowledgements

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [OmniDimension](https://omnidim.io/) for AI voice and chatbot

---

**Let’s rekindle learning and connection, one story and game at a time!**

---
