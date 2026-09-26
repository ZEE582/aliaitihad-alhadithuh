# Aliaitihad Kindergarten Backend Server

Backend API for Aliaitihad Kindergarten Management System.

## Features

- User Authentication (Admin, Teacher, Parent)
- Children Management
- Parents Management
- Teachers Management
- Classes Management
- Subjects Management
- Sessions Management
- Attendance Tracking
- Notes System
- Messaging System
- Reports Generation

## Tech Stack

- Node.js
- Express.js
- MySQL (Sequelize ORM)
- JWT Authentication
- BCrypt for password hashing

## Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=aliaitihad_kindergarten
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

3. Make sure MySQL is running on your machine and create the database:

```sql
CREATE DATABASE aliaitihad_kindergarten;
```

## Running the Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will run on port 5000 by default.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Children

- `GET /api/children` - Get all children
- `GET /api/children/:id` - Get child by ID
- `POST /api/children` - Create new child (admin/teacher)
- `PUT /api/children/:id` - Update child
- `DELETE /api/children/:id` - Delete child (admin only)

### Parents

- `GET /api/parents` - Get all parents (admin/teacher)
- `GET /api/parents/:id` - Get parent by ID
- `POST /api/parents` - Create parent profile (admin)
- `PUT /api/parents/:id` - Update parent

### Teachers

- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get teacher by ID
- `POST /api/teachers` - Create teacher profile (admin)
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher (admin only)

### Classes

- `GET /api/classes` - Get all classes
- `GET /api/classes/:id` - Get class by ID
- `POST /api/classes` - Create new class (admin)
- `PUT /api/classes/:id` - Update class (admin)
- `DELETE /api/classes/:id` - Delete class (admin only)

### Subjects

- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:id` - Get subject by ID
- `POST /api/subjects` - Create new subject (admin/teacher)
- `PUT /api/subjects/:id` - Update subject (admin/teacher)
- `DELETE /api/subjects/:id` - Delete subject (admin only)

### Sessions

- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get session by ID
- `POST /api/sessions` - Create new session (admin/teacher)
- `PUT /api/sessions/:id` - Update session (admin/teacher)
- `DELETE /api/sessions/:id` - Delete session (admin only)

### Attendance

- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/:id` - Get attendance by ID
- `POST /api/attendance` - Create attendance record (admin/teacher)
- `PUT /api/attendance/:id` - Update attendance (admin/teacher)
- `DELETE /api/attendance/:id` - Delete attendance (admin only)

### Notes

- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get note by ID
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Messages

- `GET /api/messages` - Get all messages for user
- `GET /api/messages/sent` - Get sent messages
- `GET /api/messages/inbox` - Get received messages
- `GET /api/messages/:id` - Get message by ID
- `POST /api/messages` - Create new message
- `PUT /api/messages/:id/read` - Mark message as read
- `DELETE /api/messages/:id` - Delete message

### Reports

- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get report by ID
- `POST /api/reports` - Create new report (admin/teacher)
- `DELETE /api/reports/:id` - Delete report (admin only)

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Role-Based Access Control

- **Admin**: Full access to all endpoints
- **Teacher**: Access to children, classes, subjects, sessions, attendance, notes, and reports
- **Parent**: Read access to their children's data, messages, and reports
