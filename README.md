📝 Todolist-V1
A Node.js and Express-based To-Do List Application that allows users to manage their daily tasks and work-related items efficiently. It uses EJS for server-side rendering, integrates with MongoDB Atlas for cloud-based data storage, and supports full CRUD operations — Create, Read, Update, and Delete.

🚀 Features
✅ Add tasks to Home and Work lists

✅ Delete tasks when completed

✅ Edit and update tasks seamlessly

✅ Uses MongoDB Atlas to persist data in the cloud

✅ Clean and responsive UI using EJS templating

✅ Separated logic for general and work-specific tasks

🛠️ Tech Stack
Node.js

Express.js

MongoDB Atlas (Cloud-hosted MongoDB)

Mongoose (ODM)

EJS (Embedded JavaScript Templates)

dotenv (for managing environment variables)

📦 Installation & Setup
Clone the repository:

bash
Copy
Edit
git clone https://github.com/your-username/todolist-v1.git
cd todolist-v1
Install dependencies:

bash
Copy
Edit
npm install
Configure environment variables:
Create a .env file and add your MongoDB Atlas URI:

ini
Copy
Edit
DB_USER=yourMongoUsername
DB_PASSWORD=yourMongoPassword
Run the app:

bash
Copy
Edit
node app.js
Visit in your browser:
http://localhost:3000

📁 Folder Structure
bash
Copy
Edit
├── views/            # EJS Templates
├── public/           # Static assets (CSS, images)
├── app.js            # Main application file
├── .env              # Environment variables
└── package.json
✨ Usage
Go to / to access the Home List

Go to /work for Work-related tasks

Add, edit, update, or delete items easily

Data is saved automatically in MongoDB Atlas

📌 Future Improvements
Add user authentication

desktop responsive design

💡 Author
Made with 💻 by Emelda
