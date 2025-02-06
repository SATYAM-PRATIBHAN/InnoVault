# InnoVault

InnoVault is an open-source idea vault where developers can share, upvote, and discuss project ideas. The platform allows multiple users to claim and work on an idea simultaneously. Each user's interaction with an idea is tracked individually, ensuring personalized status updates. InnoVault encourages collaboration and innovation by providing a space to explore and execute new projects.

<img width="1440" alt="Screenshot 2025-02-06 at 16 54 31" src="https://github.com/user-attachments/assets/5525b519-7cd5-4654-b245-07cd39a52f0d" />


## Features

- **Community-Driven Idea Repository**: Users can browse and contribute project ideas.
- **Upvote System**: Vote on ideas to highlight popular and impactful projects.
- **Claiming System**: Multiple users can claim an idea to work on it.
- **Project Card Metrics**: Displays the number of upvotes and claims for better visibility.
- **Monochrome Theme**: Aesthetic and modern UI with a minimalist design.
- **Data Storage**: Uses PostgreSQL for persistent data storage with Prisma ORM.

## Tech Stack

- **Frontend**: TypeScript, Next.js
- **Backend**: PostgreSQL (via Prisma ORM)
- **Storage**: PostgreSQL for storing project and user data
- **Styling**: Custom monochrome theme with Tailwind CSS

## Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/innovault.git
   ```
2. Navigate to the project directory:
   ```sh
   cd innovault
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up your PostgreSQL database (ensure you have PostgreSQL installed and running).
5. Create a `.env` file and add the following connection string:
   ```sh
   DATABASE_URL="postgresql://yourusername:yourpassword@localhost:5432/yourDbName"
   ```
6. Run Prisma migrations to set up the database:
   ```sh
   npx prisma migrate dev
   ```
7. Start the development Server:
   ```sh
   npm run dev
   ```

## Usage

- Browse project ideas and upvote interesting ones.
- Claim ideas to work on them.
- Contribute new ideas to the platform.

## Contribution

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature-branch
   ```
3. Make your changes and commit them:
   ```sh
   git commit -m "Add new feature"
   ```
4. Push to your forked repository:
   ```sh
   git push origin feature-branch
   ```
5. Submit a Pull Request.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Contact

For any inquiries or collaborations, feel free to reach out!
