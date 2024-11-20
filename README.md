# WhatsApp Template Editor

A robust React-based application for creating, editing, and previewing WhatsApp message templates with dynamic variable support. This editor provides a real-time preview feature, ensuring accurate formatting and validation of message templates.


## Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **State Management:** React Context API
- **HTTP Client:** Fetch API
- **Development Tools:** ESLint, TypeScript

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- A running backend server (separate repository)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/subinoybiswas/whatsapp-template-frontend

   ```

2. Navigate to the project directory:
   ```bash
   cd whatsapp-template-frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables: Create a .env file in the root directory and add the following:

   ```env
   VITE_BACKEND_URL=http://localhost:5000  # Replace with your backend URL

   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Running the Application

1. Start the backend server as per its documentation.
2. Open the frontend application in your browser at:
   http://localhost:5173
3. The template editor interface should load, ready for use.

## Usage Guide

### Creating Templates

#### Enter Template Text

- Type your message in the editor.
- Use the `{{variable_name}}` syntax to add placeholders for dynamic content.
- Example:
  ```text
  Hello {{customer_name}}, your order will arrive in {{delivery_time}}.
  ```

#### Variable Rules

- Variables must be enclosed in double curly braces (`{{ }}`).
- Only letters and underscores are allowed in variable names.
  - **Valid Examples:** `{{user_name}}`, `{{status}}`
  - **Invalid Examples:** `{{user123}}`, `{{user-name}}`

#### Fill Variables

- Input fields for each variable will be generated automatically.
- Enter values into the generated fields to populate the template.
- The preview will update in real-time as you type.
