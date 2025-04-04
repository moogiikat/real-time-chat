# Real-Time Chat App

This is a real-time chat application built with Next.js and Supabase. The app allows users to join chat rooms, send messages, and see messages from other users in real-time.

## Features

- Real-time messaging
- Join existing chat rooms or create new ones
- Responsive design

## Technologies Used

- Next.js
- Supabase
- React
- TypeScript
- Tailwind CSS
- Radix UI

## Getting Started

### Prerequisites

- npm or pnpm
- Supabase account

### Installation

1.  Clone the repository:

2.  Install dependencies:

    ```bash
    npm install
    # or
    pnpm install
    ```

3.  Set up Supabase:

    - Create a new project in Supabase.
    - Create a new database in Supabase.
      table name: `chat_messages`
      columns:
      - id: uuid
      - content: text
      - user_name: text
      - room_name: text
      - created_at: timestamp
    - Copy the `supabaseUrl` and `supabaseKey` from your Supabase project settings.
    - Create a `.env.local` file in the root of your project and add the following:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=
    ```

4.  Run the development server:

    ```bash
    npm run dev
    # or
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
