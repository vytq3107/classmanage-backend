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
cd ./backend/services/auth
node app.js
```
Fimilar for user, lesson, and chat service

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
<img width="1180" height="635" alt="image" src="https://github.com/user-attachments/assets/65ee2a30-3c1a-4f78-a9ec-6a978b2b78b5" />

2. **Phone Number + OTP**  
   - Enter the phone number, and the OTP will appear in the terminal running the `auth` service.
<img width="1178" height="551" alt="image" src="https://github.com/user-attachments/assets/b79a5b5f-fd4f-4319-852c-f685afd256a4" />

3. **Email + OTP**  
   - Similar to the phone login, OTP will be printed in the terminal.
<img width="1178" height="568" alt="image" src="https://github.com/user-attachments/assets/2d911a24-7b63-4e03-aef2-3229b9f0828e" />

## Instructor Flow

Once logged in as an instructor, you can add a student to the system. The student will receive a registration link via email. Clicking the link will lead to a form where they confirm their phone number and complete registration.

> ⚠️ **Important Note**:  
> For phone verification and registration, only **one phone number** is supported due to Twilio's free-tier limitation.  
> Use: `+18777804236` (Canada region code +1)



## Dashboard Overview
You log in using the instructor account, you will be redirected to the **Dashboard** page.
<img width="995" height="590" alt="image" src="https://github.com/user-attachments/assets/e8b51e09-e275-4a69-bdde-f936323a1151" />


### Key Features

- **Add Student**: Click the "Add Student" button to add a new student to the system.
<img width="997" height="595" alt="image" src="https://github.com/user-attachments/assets/5229033c-afce-4979-b3dc-19ad78403b1a" />

- **Student Invitation**: After being added, the student will automatically receive an email containing a registration link.
<img width="667" height="341" alt="image" src="https://github.com/user-attachments/assets/261789f4-d38c-4fd7-a1dd-56c364608534" />

- **Account Creation**: When the student clicks the link, they will be redirected to a phone number verification page, followed by a form to enter their username and password.
<img width="994" height="451" alt="image" src="https://github.com/user-attachments/assets/69ce7977-f64c-4ae3-931a-70c8a60f5205" />
<img width="994" height="592" alt="image" src="https://github.com/user-attachments/assets/417447b1-483f-4a23-8584-0c59687a09d9" />

  - Passwords are securely **hashed** in the database to ensure user security.
<img width="1020" height="544" alt="image" src="https://github.com/user-attachments/assets/cac5c01e-c54f-4a39-ad3a-2cdb8a9e3e97" />

- **Lesson Management**: The instructor can view which lesson each student is currently enrolled in and track their progress (whether they have completed the lesson or not).
<img width="1031" height="562" alt="image" src="https://github.com/user-attachments/assets/661f0a1b-0174-48a9-a8db-a01a8357c28f" />

- **Chat Functionality**: An instructor can click the chat button to view the list of students and open a chatbox to communicate with them directly. But it's not really word stably
<img width="855" height="487" alt="image" src="https://github.com/user-attachments/assets/0d92b06c-589a-48c5-9e82-35f00118808e" />
<img width="1011" height="548" alt="image" src="https://github.com/user-attachments/assets/2187b2a3-1a02-4607-8294-934604ef6396" />

Back to Backend, api document I saved in this Google Doc. If you want to check my api, please access this:
https://docs.google.com/document/d/1Wx8SMe91fereyV-xictBxUaVFkEiWtxg1t1HpqiMTFs/edit?usp=sharing

## Final Notes
This website is still missing many important features and does not fully meet the challenge requirements. However, I’ve approached this task with a serious attitude and invested genuine effort into its development.

Thank you so much for reviewing my work.

If you have any questions or need help running the app, feel free to reach out.
Contact: vytq3107forwork@gmail.com


