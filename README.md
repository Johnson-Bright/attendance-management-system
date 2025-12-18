# Attendance Management System

Complete Organizational Management Solution
Streamline your organization's operations with our comprehensive management system. Track attendance, manage members, handle permissions, create announcements, and maintain discipline - all in one powerful platform.

## 🚀 Features

### Multi-Role Dashboard System
- **CEO Dashboard**: Complete system oversight, user management, case decisions
- **Committee Dashboard**: Member management, announcements, content creation  
- **Discipline Dashboard**: Attendance marking, permission request approvals
- **Member Dashboard**: Personal data access, idea submission, announcements

### Core Functionality
- ✅ **Real-time Attendance Tracking** with database persistence
- ✅ **User Management System** with secure authentication
- ✅ **Permission Request Workflow** with approval system
- ✅ **Announcement Management** with role-based publishing
- ✅ **Member Management** with comprehensive profiles
- ✅ **Role-based Access Control** with secure login system

## 🛠️ Technology Stack

### Frontend
- **React.js** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Responsive styling
- **Vite** - Fast development server

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **RESTful APIs** - Standard communication protocol

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database server
- **Git** for version control

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd attendance-webapp
```

### 2. Install Dependencies

#### Backend Setup
```bash
cd backend
npm install
```

#### Frontend Setup
```bash
cd frontend
npm install
```

### 3. Database Configuration

1. Create a PostgreSQL database named `attendance_app`
2. Update the database connection in `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/attendance_app
```

### 4. Start the Application

#### Start Backend Server
```bash
cd backend
npm start
```
Server runs on: http://localhost:3001

#### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Application runs on: http://localhost:3002

## 🔐 Default Login Credentials

### Demo Accounts
- **CEO**: `ceo@techhub.com`
- **Committee**: `committee@techhub.com`  
- **Discipline**: `discipline@techhub.com`
- **Member**: `member@techhub.com`

*Note: Use the quick login buttons for demo access, or create new users via CEO dashboard*

## 📊 Database Schema

### Core Tables
- **users** - User accounts with authentication
- **members** - Organization member profiles
- **attendance_records** - Daily attendance tracking
- **permission_requests** - Permission request workflow
- **announcements** - System announcements
- **companies** - Organization information

## 🎯 Usage Guide

### For CEOs
1. Login with CEO credentials
2. Access "Users" tab to create new user accounts
3. Manage system-wide settings and user roles
4. Review and decide on disciplinary cases

### For Committee Members
1. Login with committee credentials
2. Manage organization members
3. Create and publish announcements
4. View attendance reports

### For Discipline Officers
1. Login with discipline credentials
2. Mark daily attendance for members
3. Review and approve permission requests
4. Generate attendance reports

### For Members
1. Login with member credentials
2. View personal attendance history
3. Submit permission requests
4. Read announcements and updates

## 🔧 API Endpoints

### Authentication
- `POST /login` - User authentication
- `GET /users` - Get user list
- `POST /users` - Create new user

### Attendance Management
- `GET /attendance` - Get attendance records
- `POST /attendance` - Mark attendance
- `GET /members` - Get member list
- `POST /members` - Add new member

### Permission System
- `GET /permissions` - Get permission requests
- `POST /permissions` - Submit permission request
- `PATCH /permissions/:id` - Update permission status

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd backend
npm start
```

### Environment Variables
Create `.env` file in backend directory:
```env
DATABASE_URL=postgresql://username:password@host:port/database
PORT=3001
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📝 Version Control

This project uses **Git** for version control with the following workflow:
- **Main Branch**: Production-ready code
- **Feature Branches**: New feature development
- **Commit Messages**: Conventional commit format
- **Pull Requests**: Code review process

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Developer**: [Your Name]
- **Project Type**: Academic/Portfolio Project
- **Institution**: [Your Institution]

## 📞 Support

For support and questions:
- **Email**: [your.email@domain.com]
- **GitHub Issues**: [repository-issues-url]

---

**Built with ❤️ using modern web technologies**
