# Unified Public Service Access Portal

A centralized web portal where citizens use a single login to submit complaints and service requests for civic services (Water Supply, Electricity, Street Lighting, Waste Management, Fire Services, Public Health) and track their status in real time.

## Live Link
https://civic-portal-at5p.onrender.com

> Note: Hosted on a free plan, so the first load may take 30-60 seconds.

## Features

- Single sign-on with role-based access (Citizen, Official, Admin)
- Citizen: register, submit complaints, auto-generated tracking ID, status tracking, service history
- Official: view department complaints, update status, set priority, add resolution remarks
- Admin: city-wide dashboard, complaint statistics, average resolution time, assign officials

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB Atlas (Mongoose)
- Authentication: JWT, bcryptjs
- Deployment: Render

## Test Credentials

| Role | Email | Password |
|---|---|---|
| Citizen | falak5@test.com | Portal1234 |
| Admin | admin@portal.com | Admin1234 |
| Official (Water Supply) | water@portal.com | Admin1234 |
| Official (Electricity) | electricity@portal.com | Admin1234 |
| Official (Street Lighting) | street@portal.com | Admin1234 |
| Official (Waste Management) | waste@portal.com | Admin1234 |
| Official (Fire Services) | fire@portal.com | Admin1234 |
| Official (Public Health) | public@portal.com | Admin1234 |

## Installation (Local)

1. Clone the repository
```
   git clone https://github.com/falakuzma1234-alt/civic-portal.git
   cd civic-portal/backend
```
2. Install dependencies
```
   npm install
```
3. Create a `.env` file inside the `backend` folder
```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
```
4. Create admin and official accounts
```
   node seed.js
```
5. Start the server
```
   npm start
```
6. Open `http://localhost:5000/index.html`

## Project Structure

```
civic-portal/
├── backend/
│   ├── middleware/   (JWT and role checks)
│   ├── models/       (User, Complaint)
│   ├── routes/       (auth, complaints, admin)
│   ├── seed.js
│   └── server.js
└── frontend/
    ├── index.html, login.html, register.html
    ├── dashboard.html, official.html, admin.html
    └── design.css, config.js, auth.js, dashboard.js, official.js, admin.js
```

## User Flow

1. Citizen registers and logs in
2. Selects a department and submits a complaint
3. Receives a tracking ID
4. Official updates status and remarks
5. Citizen sees the update on the dashboard
6. Admin monitors statistics and assigns officials