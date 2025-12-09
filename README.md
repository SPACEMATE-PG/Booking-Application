# PG Stay - Professional Accommodation Booking Platform

PG Stay is a modern, high-performance web application designed to streamline the process of finding and booking Paying Guest (PG) accommodations. Built with the latest web technologies, it offers a seamless experience for both users and property managers.

## 🚀 Technology Stack

This project is engineered using a robust and scalable tech stack:

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/) for type safety
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) with [Tailwind CSS Animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) primitives & [Lucide React](https://lucide.dev/) icons
- **Database:** [PostgreSQL](https://www.postgresql.org/) managed by [Supabase](https://supabase.com/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/) for type-safe database access
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Charts:** [Recharts](https://recharts.org/) for analytics

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/pg-stay.git
    cd pg-stay
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory. You can copy the `.env.example` if available.
    
    Required variables:
    ```env
    # Supabase Connection
    SUPABASE_URL=your_supabase_project_url
    SUPABASE_ANON_KEY=your_supabase_anon_key
    
    # Database Connection (Transaction Pooler URL recommended for serverless)
    SUPABASE_DB_URL=postgresql://postgres.user:password@host:port/postgres
    ```

4.  **Database Migration (Optional):**
    If setting up a fresh database:
    ```bash
    npx drizzle-kit push
    ```

5.  **Run Development Server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📁 Project Structure

```
├── .agent/             # AI Agent workflows
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router pages & layouts
│   ├── components/     # Reusable UI components
│   │   ├── ui/         # Base UI elements (buttons, inputs, etc.)
│   ├── db/             # Database configuration & schema
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   └── types/          # Global TypeScript types
├── .env                # Environment variables
├── drizzle.config.ts   # Drizzle Kit configuration
├── next.config.ts      # Next.js configuration
├── package.json        # Dependencies & scripts
└── USER_GUIDE.md       # Detailed user manual
```

## 🔑 Key Features

- **Advanced Property Search:** Filter by location, price, gender, and amenities.
- **Interactive Maps:** View property locations directly on Google Maps.
- **Booking Management:** Seamless booking process with real-time availability.
- **Secure Payments:** Integrated payment processing flow.
- **User Dashboard:** Manage current stays, history, and profile.
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop.

## 🤝 Contributing

We welcome contributions! Please see our contribution guidelines (if applicable) or follow these steps:

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
