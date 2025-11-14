# IIT Jammu Post Office Automation System

A comprehensive web-based post office management system designed specifically for IIT Jammu campus to streamline mail and parcel handling operations.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### For Users (Students/Faculty/Staff)
- **Dashboard Overview**: View all parcels at a glance with real-time statistics
- **Parcel Tracking**: Track incoming and outgoing parcels with detailed status updates
- **Real-time Notifications**: Get instant notifications for parcel status changes
- **Delivery History**: Complete history of all received parcels
- **Profile Management**: Manage personal information and contact details
- **Expected Delivery Dates**: View estimated delivery times for pending parcels

### For Employees
- **Parcel Management**: Handle and update status of assigned parcels
- **Package Registration**: Add new incoming/outgoing parcels to the system
- **Status Updates**: Update parcel status (Pending, In Transit, Delivered, etc.)
- **Performance Metrics**: View personal performance statistics
  - Total assigned parcels
  - Delivery success rate
  - Average delivery time
  - Daily delivery count
- **Activity Tracking**: Monitor recent activities and tracking events
- **Automated Notifications**: System automatically notifies users of status changes

### For Administrators
- **System Dashboard**: Comprehensive overview of entire post office operations
- **Analytics & Reports**: 
  - Total parcels processed
  - Deliveries and returns per day
  - Average delivery time
  - Active users and employees
- **Parcel Oversight**: View and manage all parcels in the system
- **Status Summary**: Visual representation of parcel distribution by status
- **Daily Statistics**: Track system performance over the last 7 days
- **User Management**: Monitor total users and active employees
- **Visual Charts**: Interactive doughnut charts for status visualization

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (with Vite)
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Charts**: Chart.js with react-chartjs-2
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: MySQL 2
- **ORM**: MySQL2 with Promise support
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Environment**: dotenv

### Additional Tools
- **Email**: Nodemailer (for notifications)
- **CORS**: Enabled for cross-origin requests
- **Dev Server**: nodemon for development

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐ │
│  │ User Dashboard│  │Emp Dashboard  │  │Admin Dashboard│ │
│  └───────────────┘  └───────────────┘  └───────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST API
┌──────────────────────────┴──────────────────────────────────┐
│                   Backend (Express.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │ User Routes  │  │ Emp Routes   │  │ Admin Routes     │ │
│  └──────────────┘  └──────────────┘  └──────────────────┘ │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │ Auth Routes  │  │Notification  │                       │
│  └──────────────┘  │  Service     │                       │
│                    └──────────────┘                        │
└──────────────────────────┬──────────────────────────────────┘
                           │ MySQL2
┌──────────────────────────┴──────────────────────────────────┐
│                     MySQL Database                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Tables: Person, Employee, MailItem, Notification,    │  │
│  │ TrackingEvent, DeliveryRecord, PostOffice, etc.      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd iit-jammu-post-office
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../FRONT
npm install
```

## 🗄️ Database Setup

### Step 1: Create Database
```sql
CREATE DATABASE iitjammu1;
USE iitjammu1;
```

### Step 2: Run SQL Schema
Execute the SQL files in the following order:
```bash
mysql -u root -p iitjammu1 < database/vs2.sql
```

### Step 3: Verify Tables
Ensure the following tables are created:
- `Person` - Users (students, faculty, staff)
- `Employee` - Post office employees
- `PostOffice` - Post office details
- `MailItem` - Parcels and mail items
- `TrackingEvent` - Parcel tracking history
- `DeliveryRecord` - Delivery confirmations
- `Notification` - User notifications
- `Department` - Academic departments
- `Building` - Campus buildings

## ⚙️ Configuration

### Backend Configuration
Create a `.env` file in the `/backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=iitjammu1

# Server Configuration
PORT=5000
```

### Frontend Configuration
Create a `.env` file in the `/FRONT` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000
```

## 🚀 Usage

### Development Mode

#### Start Backend Server
```bash
cd backend
npm install
node server.js
# or with nodemon for auto-reload
npx nodemon server.js
```

#### Start Frontend Development Server
```bash
cd FRONT
npm install
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### Production Build

#### Build Frontend
```bash
cd FRONT
npm run build
```

## 📡 API Endpoints

### Authentication
```
POST   /login                    # User/Employee/Admin login
```

### User Routes (`/api/user`)
```
GET    /profile/:id              # Get user profile
POST   /signup                   # User registration
GET    /parcels/in-transit/:id   # Get parcels in transit
GET    /parcels/history/:id      # Get parcel history
GET    /parcels/upcoming/:id     # Get upcoming deliveries
GET    /parcels/recent-events/:id # Get recent tracking events
GET    /delivery-records/:id     # Get delivery records
GET    /notifications/:id        # Get user notifications
```

### Employee Routes (`/api/employee`)
```
GET    /profile/:id                    # Get employee profile
GET    /parcels/assigned/:id           # Get assigned parcels
POST   /parcels/update-status          # Update parcel status
POST   /parcels/create                 # Create new parcel
GET    /parcels/recent-events/:id      # Get recent activities
GET    /metrics/:id                    # Get employee performance metrics
```

### Admin Routes (`/api/admin`)
```
GET    /profile/:id              # Get admin profile
GET    /summary                  # Get status summary
GET    /metrics                  # Get system-wide metrics
GET    /daily-stats              # Get last 7 days statistics
GET    /parcels                  # Get all parcels (with optional status filter)
```

### Notification Routes (`/api/notifications`)
```
GET    /:personId                # Get all notifications for user
POST   /mark-read/:notificationId # Mark notification as read
POST   /mark-all-read/:personId  # Mark all as read
GET    /unread-count/:personId   # Get unread notification count
POST   /generate-dummy           # Generate dummy notifications (dev only)
```

## 👥 User Roles

### 1. User (Student/Faculty/Staff)
- **Login**: Email + Password + Role: "user"
- **Capabilities**: View parcels, track deliveries, receive notifications
- **Dashboard**: Personal parcel overview and tracking

### 2. Employee
- **Login**: LoginID + Password + Role: "employee"
- **Capabilities**: Manage parcels, update status, add new packages
- **Dashboard**: Assigned parcels and performance metrics

### 3. Admin
- **Login**: LoginID + Password + Role: "admin"
- **Capabilities**: Full system access, analytics, oversight
- **Dashboard**: System-wide statistics and management

## 🎨 Key Features Explained

### Notification System
The system includes an intelligent notification service that:
- Automatically generates notifications when parcel status changes
- Sends notifications for new parcel arrivals
- Provides real-time unread count badges
- Allows marking individual or all notifications as read
- Includes dummy notification generator for testing

### Performance Metrics
- **For Employees**: Track personal success rate, average delivery time, and daily goals
- **For Admins**: Monitor system-wide performance, user engagement, and operational efficiency

### Parcel Tracking
- Real-time status updates
- Complete event history
- Expected delivery date tracking
- Multi-status support (Pending, Waiting, In Transit, Delivered, Returned)

### Visual Analytics
- Interactive charts using Chart.js
- Doughnut charts for status distribution
- Daily statistics visualization
- Responsive design for all screen sizes

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- CORS protection
- SQL injection prevention with parameterized queries
- Input validation on all forms

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔄 Future Enhancements

- [ ] Email integration for notifications
- [ ] SMS alerts for delivery updates
- [ ] Barcode scanner integration
- [ ] Advanced search and filtering
- [ ] Export data to CSV/PDF
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile app (React Native)

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For support, email support@iitjammu.ac.in or create an issue in the repository.

---

