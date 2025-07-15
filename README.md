
# Class Management App – Backend

## Introduction

First of all, I want to sincerely acknowledge that although I have invested significant time and effort into building this application according to the challenge requirements, I was not able to fully complete all the tasks. There are still several missing features and areas that need improvement.

As part of the challenge rules, I avoided using AI tools to generate code, which I understand is a fair way to evaluate individual capability. However, this also significantly increased the development time, leading to lower productivity. That said, I’ve put in genuine effort over the past 5 days, and I would like to share the results of my work in this repository.

## Repository Structure

The project is divided into two main parts:

- **Backend** (this repository): https://github.com/vytq3107/classmanage-backend  
- **Frontend**: https://github.com/vytq3107/classmanage-frontend  

> ⚠️ These instructions are written for **Windows** users with **Node.js already installed**.

## Getting Started

### 1. Clone Repositories

Create a new folder on your computer and navigate into it. Then clone both backend and frontend repositories using the following commands:

```bash
git clone https://github.com/vytq3107/classmanage-backend.git
git clone https://github.com/vytq3107/classmanage-frontend.git
```

### 2. Firebase Configuration

Due to Firebase's restriction on publishing service account keys in public repositories, you will need to manually configure the Firebase credentials.

- I have sent the Firebase key file via email. Please download it.
- Replace the existing file in `/backend/key` with the one you received.
- In the file `/backend/config/firebase.js`, locate this line:

```js
const serviceAccount = require('./key/classroom-database-d5341-firebase-adminsdk-fbsvc-fe7ea341cf.json');
```

- Update the filename to match the Firebase key file you just pasted.

### 3. Start Backend Services

The backend is built using a **microservices architecture**, with each service running on a different port. Please make sure ports **5000 to 5003** are available on your system.

Open **four terminal windows** and run the following commands (one per terminal):

```bash
node ./backend/services/auth/app.js
node ./backend/services/user/app.js
node ./backend/services/lesson/app.js
node ./backend/services/chat/app.js
```

### 4. Start the Frontend

Open a new terminal window and run the following commands from the root directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on port **3000**.

## Accessing the App

To access the login page, open your browser and go to:

```
http://localhost:3000/auth/login
```

There are **three login methods** available:

1. **Username/Password**  
   - Example credentials (Instructor account):  
     - Username: `tranquoccuong`  
     - Password: `abc`

2. **Phone Number + OTP**  
   - Enter the phone number, and the OTP will appear in the terminal running the `auth` service.

3. **Email + OTP**  
   - Similar to the phone login, OTP will be printed in the terminal.

## Instructor Flow

Once logged in as an instructor, you can add a student to the system. The student will receive a registration link via email. Clicking the link will lead to a form where they confirm their phone number and complete registration.

> ⚠️ **Important Note**:  
> For phone verification and registration, only **one phone number** is supported due to Twilio's free-tier limitation.  
> Use: `+18777804236` (Canada region code +1)

If you have any questions or need help running the app, feel free to reach out.

<img width="559" height="501" alt="image" src="https://github.com/user-attachments/assets/f4066056-c3e9-4792-96d4-fdde8bdb950c" />
<img width="537" height="395" alt="image" src="https://github.com/user-attachments/assets/ada3ce23-962e-423f-a326-d7f38495542d" />
<img width="508" height="349" alt="image" src="https://github.com/user-attachments/assets/8c556c0b-c869-485a-970a-4258264748f5" />


