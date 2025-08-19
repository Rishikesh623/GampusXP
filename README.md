# CampusXP

CampusXP is an app designed to gamify the academic journey, offering tools for students to stay organized, track assignments, and engage with peers.

## Features
- **Dashboard** with assignments, rewards, and schedules.
- **Gamification** through Aura points and achievements.
- **Assignment & Schedule Management**
- **Leaderboards** for social engagement.

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation
1. Clone the repo:
   ```bash
   git clone <repo-url>
   cd CampusXP
   ```

2. Install dependencies for both server and client:
   ```bash
   cd server
   npm install
   cd ../client
   npm install
   ```

### Running the Application
1. Start the server:
   ```bash
   cd server
   npm start
   ```

2. Start the client:
   ```bash
   cd ../client
   npm start
   ```
### .env
1. Client
   REACT_APP_BASE_URL=http://localhost:5000
   
3. server
   PORT = 5000
   JWT_SECRET_KEY = your_secret_key
   NODE_ENV = dev/prod
   MOGO_URI = mongo uri
   ORIGIN_URL = prod client address 
   DOMAIN = prod server address
   COORDINATOR_ID = 
   COORDINATOR_PASSWORD = 
### to do 
challenge anybody (give & take aura points)
assignment completr after due point decreeas aua point

### License
MIT License
