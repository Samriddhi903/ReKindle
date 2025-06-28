# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# ReKindle Frontend

## Connecting to Backend for Details Storage

To store user details and uploaded images in MongoDB, you need to run the backend server provided in the `rekindle-backend` folder (see below for setup). The frontend form will POST data to the backend at `http://localhost:5000/api/details`.

---

# Backend Setup (rekindle-backend)

1. Go to the `rekindle-backend` folder.
2. Run `npm install` to install dependencies.
3. Start MongoDB locally (or update the connection string in `.env`).
4. Run `npm start` to start the backend server on port 5000.

---

# Frontend Form Submission

The Details form in the frontend is configured to send data and images to the backend using `FormData`.

---

# Folder Structure

- rekindle-frontend/ (this folder)
- rekindle-backend/ (Node.js/Express backend)
