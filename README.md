# Anonym

Anonym is a Next.js application built with TypeScript that enables users to send and receive anonymous messages seamlessly. To enhance user engagement, it integrates the Google Gemini API for generating fun and witty questions. 

The application addresses a **critical challenge faced by anonymous messaging platforms—ensuring user safety**. It incorporates a **dedicated Safe Mode** that effectively **filters harmful or abusive content**, tackling issues like **extortion, blackmail, and the transmission of harmful or explicit messages**.

Anonym provides two core interfaces: one for users to view received messages and another for sending anonymous messages. Authentication is securely managed using **NextAuth**, ensuring user privacy and data protection.

## Features

- **Anonymous Messaging**: Users can send and receive anonymous messages.
- **LLM Integration**: Generates random prompts or questions using the Gemini Flash 2.0 API.
- **Safe Mode(Harmful Content Monitoring): Classifies content into whether it is harmful or not and does not allow harmful messages to be sent in safe mode.
- **Authentication**: Secure user authentication with NextAuth.
- **User Interfaces**: Separate interfaces for sending and receiving messages.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack

- **Frontend**: Next.js, TypeScript
- **Authentication**: NextAuth.js
- **API**: Gemini (Google AI Studio) API
- **Styling**: Tailwind CSS
- **Database**: MongoDB

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (>= 14.x)
- npm or yarn
- A MongoDB database instance (if using a database)
- A Gemini API key (from Google AI Studio)

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
GEMINI_API_KEY = ""
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
  <li>Once you reach your dashboard, copy over your unique link and share for others to ask questions or comment</li>
  <li>User can switch on safe-mode for harmful content detection</li>
  <li>For the enquirer, type in your custom message or can ask AI to provide question suggestions.</li>
  <li>Then send the question/comment.</li>
  <li>If safe mode is ON, message only gets transfered if it does not contain any harmful/abusive content.</li>
</ul>
