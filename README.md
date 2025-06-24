:

🚚 Delivery Management System
This is a full-stack Delivery Management System built using Node.js, MongoDB, and React.
It allows managing warehouses, agents, orders, and calculating wages based on delivery performance.

📂 Project Structure
perl
Copy
Edit
delivery-management
│
├── backend/        # Node.js + Express + MongoDB
│   └── ...
│
├── frontend/       # React + Redux + Tailwind CSS
│   └── ...
│
└── README.md
🚀 How to Run
Make sure you have Node.js and MongoDB installed.

1. Clone the repository
bash
Copy
Edit
git clone https://github.com/praveenkumar2511/delivery-management-system.git
cd delivery-management-system
2. Install dependencies
bash
Copy
Edit
npm install
If you're using workspaces or separate package.json files inside frontend/ and backend/, install dependencies in each folder:

bash
Copy
Edit
cd frontend && npm install
cd ../backend && npm install
3. Start the application
bash
Copy
Edit
npm run dev
This will run both frontend and backend using concurrently.

🌟 Features
Agent Check-In/Check-Out tracking

Wages calculated based on order count

Redis for active agent tracking

Session-based login tracking

Daily work limits (Max 10 hrs / 100 KM)

Warehouse and order management



📦 Tech Stack
Frontend: React, Redux Toolkit, Tailwind CSS

Backend: Node.js, Express, MongoDB, Redis

Database: MongoDB Atlas / Local MongoDB /mongoose

Caching/State: Redis


Developer
Praveen Kumar S
