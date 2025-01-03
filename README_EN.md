# Make2025

Make2025 is a web application designed to help users set and manage their goals for a better 2025. The project is built as a full-stack application with a React-based frontend and a Node.js/Express backend, hosted on AWS.

---
## 🌐 Live Demo

Access the deployed application here: [Make2025 Live](http://make2025.click)

---

## 📋 Features

- **Goal Management**: Add, update, and manage personal goals.
- **Keyword Matching**: Receive personalized keywords and explanations based on your goals.
- **Email Notifications**: Send goal details directly to your email.
- **Responsive Design**: Optimized UI for various devices.

---

## 🛠️ Tech Stack

- **Frontend**: React, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Hosting**:
  - Frontend: AWS S3
  - Backend: AWS EC2

---

## 📂 Project Structure

```
make2025/
├── frontend/        # Frontend source code
│   ├── src/
│   ├── public/
│   ├── package.json
├── backend/         # Backend source code
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
├── .gitignore       # Files to ignore in version control
├── README.md        # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- MongoDB database set up

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/skhoon4u/make2025.git
   cd make2025
   ```

2. Install dependencies for both frontend and backend:

   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. Create `.env` files in both the frontend and backend directories.

### Environment Variables

- **Frontend**: Create a `.env` file in the `frontend` directory:

  ```plaintext
  REACT_APP_BACKEND_URL=http://localhost:3001/api
  ```

- **Backend**: Create a `.env` file in the `backend` directory:
  ```plaintext
  MONGODB_URI=your-mongodb-uri
  OPENAI_API_KEY=your-openai-api-key
  EMAIL_USER="your-outgoing-email-address"
  EMAIL_PASS="your-outgoing-email-password"
  JWT_SECRET=your-secret-key
  ```

### Running the Application

1. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

---


## 📝 Usage

1. Visit the live demo link or run the application locally.
2. Create an account and log in.
3. Set your goals and receive customized suggestions and explanations.
4. Email your plan to yourself or others.

---

## 🤝 Contributing

We welcome contributions! Here's how you can get started:

1. Fork this repository.
2. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature or fix description"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Submit a pull request.

---

## 🛡️ Security

- Keep your `.env` files private and never commit them to version control.
- Use environment variables to manage sensitive information.

---

## 📧 Contact

For any questions or support, reach out via email: [skhoon4u@gmail.com].
