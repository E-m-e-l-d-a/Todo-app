# TodoList App

This is a simple TodoList web application built with Node.js, Express, MongoDB, and EJS templating engine. It allows users to create and manage multiple todo lists with items.

## Features

- Default todo list on the home page (`/`)
- Custom todo lists accessible via dynamic routes (`/:customname`)
- Add new items to default or custom lists
- Edit existing items
- Delete items from lists
- Persistent storage using MongoDB with Mongoose ODM
- Environment variables support for configuration

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- EJS templating engine
- dotenv for environment variable management

## Setup and Installation

1. Clone the repository.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   DB_USER=your_mongodb_username
   DB_PASSWORD=your_mongodb_password
   PORT=5000
   ```

4. Start the application:

   ```bash
   node app.js
   ```

5. Open your browser and navigate to `http://localhost:5000`

## Application Structure

- `app.js`: Main application file containing server setup, routes, and database connection.
- `date.js`: Utility module to get the current date string.
- `views/`: Contains EJS templates for rendering pages.
- `public/`: Static assets like CSS files.

## Routes

- `GET /`: Displays the default todo list.
- `GET /:customname`: Displays a custom todo list with the name `customname`.
- `POST /`: Adds a new item to the default or custom list.
- `POST /edit`: Loads the edit page for a specific item.
- `POST /update`: Updates an existing item.
- `POST /delete`: Deletes an item from a list.

## Notes

- The app uses MongoDB Atlas for database hosting. Make sure your credentials in `.env` are correct.
- Reserved routes like `favicon.ico`, `edit`, `update`, and `delete` are blocked from being used as custom list names.

## License

This project is open source and free to use.
