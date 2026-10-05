# To-Do List Web Application

A full-stack To-Do List application built using HTML, CSS, JavaScript, Node.js, Express.js, and SQLite.

## Features

- Add new tasks
- Add tasks using the Enter key
- Edit existing tasks
- Delete tasks
- Mark tasks as completed
- Filter tasks by All, Active, and Completed
- Persistent task storage using SQLite
- REST API integration

## Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- SQLite
- better-sqlite3

## Project Structure

todo-app/
│
├── backend/
│   └── server.js
│
├── index.html
├── style.css
├── script.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Add a new task |
| PUT | `/api/tasks/:id` | Edit or update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## How to Run

1. Install Node.js.
2. Clone the repository.
3. Install dependencies:

```bash
npm install