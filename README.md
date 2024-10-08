# Anonym

Anonym is a Next.js application built with TypeScript that allows users to send and receive anonymous messages. It also leverages the OpenAI ChatGPT API to generate random questions or prompts to encourage interaction. The application features two main interfaces: one for viewing received messages and another for sending anonymous messages. Authentication is implemented using NextAuth.

## Features

- **Anonymous Messaging**: Users can send and receive anonymous messages.
- **ChatGPT Integration**: Generates random prompts or questions using the OpenAI API.
- **Authentication**: Secure user authentication with NextAuth.
- **User Interfaces**: Separate interfaces for sending and receiving messages.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack

- **Frontend**: Next.js, TypeScript
- **Authentication**: NextAuth.js
- **API**: OpenAI ChatGPT API
- **Styling**: Tailwind CSS
- **Database**: MongoDB

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (>= 14.x)
- npm or yarn
- A MongoDB database instance (if using a database)
- An OpenAI API key

### Installation

1. Clone the repository:
2. Install dependencies:

```bash
npm install
```
3. ## Running the Application

Create a `.env.local` file in the root directory and add the following environment variables:

```env
NEXTAUTH_URL = ""
NEXTAUTH_SECRET = ""
OPENAI_API_KEY = ""
MONGODB_URI = ""
RESEND_API_KEY = ""
```

4. ## Running the Development Server

Run the development server:

```bash
npm run dev
  ```
5. ## How to use?

<ul>
  <li>Create an account or Just log in as a Test User</li>
  <li>Once you reach your dashboard, copy your unique link and share for others to ask questions or comment</li>
  <li>For the enquirer, type in your custom message or can ask AI to provide question suggestions.</li>
  <li>Then send the question/comment.</li>
</ul>
