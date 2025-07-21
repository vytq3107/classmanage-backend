# Class Management App – Backend

## Introduction

First of all, I want to sincerely acknowledge that although I have invested significant time and effort into building this application according to the challenge requirements, I was not able to fully complete all the tasks. There are still several missing features and areas that need improvement.

As part of the challenge rules, I avoided using AI tools to generate code, which I understand is a fair way to evaluate individual capability. However, this also significantly increased the development time, leading to lower productivity. That said, I’ve put in genuine effort over the past 5 days, and I would like to share the results of my work in this repository.

## Repository Structure

The project is divided into two main parts:

- **Backend** (this repository): https://github.com/vytq3107/classmanage-backend  
- **Frontend**: https://github.com/vytq3107/classmanage-frontend  

Describe about structure:
Technology I use in this challege is
Backend: NodeJS (Express), Firebase Realtime, Twilio, socket.io, nodemailer, EventEmitter, develop in Microservice Structure.
Frontend: NextJS, shadcn UI, ReactJS Toast Notification, socket client, framer-motion, lucide icon.

Backend Structure:
<img width="1127" height="422" alt="image" src="https://github.com/user-attachments/assets/6ea5a3c5-9007-4157-8011-db784a10c54a" />

Frontend Structure:
<img width="1122" height="355" alt="image" src="https://github.com/user-attachments/assets/b58d2303-d14a-47e5-bf47-6f729df07194" />



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
<img width="1010" height="527" alt="image" src="https://github.com/user-attachments/assets/b4c99895-a126-4e67-8bff-a38f51efd1e1" />


2. **Phone Number + OTP**  
   - Enter the phone number, and the OTP will appear in the terminal running the `auth` service.
<img width="1005" height="515" alt="image" src="https://github.com/user-attachments/assets/d87138b1-1f98-4e5b-8aa3-ca7389a871eb" />


3. **Email + OTP**  
   - Similar to the phone login, OTP will be printed in the terminal.
<img width="1010" height="514" alt="image" src="https://github.com/user-attachments/assets/ea9e6541-8795-440f-b7fc-e02287c20800" />


## Instructor Flow

Once logged in as an instructor, you can add a student to the system. The student will receive a registration link via email. Clicking the link will lead to a form where they confirm their phone number and complete registration.

> ⚠️ **Important Note**:  
> For phone verification and registration, only **one phone number** is supported due to Twilio's free-tier limitation.  
> Use: `+18777804236` (Canada region code +1)



## Dashboard Overview
You log in using the instructor account, you will be redirected to the **Instructor Dashboard** page.
**Tab Manage Students**
<img width="1910" height="950" alt="image" src="https://github.com/user-attachments/assets/427922f6-86de-4ccb-be6f-73a82919fbc5" />

**Tab Manage Lesson**
<img width="1912" height="956" alt="image" src="https://github.com/user-attachments/assets/43088708-afbc-4119-adb7-539539065c39" />


### Key Features
- **Add Student**: Click the "Add Student" button to add a new student to the system.
<img width="1914" height="958" alt="image" src="https://github.com/user-attachments/assets/4ede5d67-2dac-494b-b11d-c1a34286af55" />


- **Student Invitation**: After being added, the student will automatically receive an email containing a registration link.
<img width="1421" height="292" alt="image" src="https://github.com/user-attachments/assets/87977e91-ceff-485a-9120-fcd5175b8265" />


- **Account Creation**: When the student clicks the link, they will be redirected to a phone number verification page, followed by a form to enter their username and password.
<img width="1011" height="493" alt="image" src="https://github.com/user-attachments/assets/f4cc8c86-ae11-4cb6-b277-746a1433d69f" />
<img width="1003" height="525" alt="image" src="https://github.com/user-attachments/assets/0aba623e-6853-4788-b66b-784a7310d9bb" />
<img width="1007" height="526" alt="image" src="https://github.com/user-attachments/assets/5fd1ee6c-5ba8-423b-8cb0-5477a01de672" />

  - Passwords are securely **hashed** in the database to ensure user security.
<img width="1020" height="544" alt="image" src="https://github.com/user-attachments/assets/cac5c01e-c54f-4a39-ad3a-2cdb8a9e3e97" />

- **Lesson Management**: The instructor can view which lesson each student is currently enrolled in and track their progress (whether they have completed the lesson or not).
<img width="1908" height="954" alt="image" src="https://github.com/user-attachments/assets/b1f90d82-347a-4a9f-beba-c234cecb785f" />
Then, you can chosse and drop lesson to student to assign lesson for them.
<img width="1914" height="950" alt="image" src="https://github.com/user-attachments/assets/ac9216a5-d8ce-4a15-afde-8e3f94e106f3" />

- **Chat Functionality**: An instructor can click the chat button to view the list of students and open a chatbox to communicate with them directly. But it's not really word stably
<img width="1913" height="949" alt="image" src="https://github.com/user-attachments/assets/00fa25c4-f749-4af2-8d82-89621e6a3797" />


You log in using the instructor account, you will be redirected to the **Student Dashboard** page.
**Tab Manage Lesson**
<img width="1908" height="954" alt="image" src="https://github.com/user-attachments/assets/05ab422b-8688-410a-9a93-26c78c7c2293" />


**Tab Edit Profile**
<img width="1006" height="586" alt="image" src="https://github.com/user-attachments/assets/d962e8d6-029a-45c5-a15f-74c25f57cdf9" />



### Key Features
- **Learn with video**: Youtube video is embedded in this website, student can learn in website.
<img width="1910" height="949" alt="image" src="https://github.com/user-attachments/assets/6a736dcc-d15f-4a9f-951c-6ba9c5755c12" />

When they learned, they can press Mark as done button to notificate to instructor they done this lesson. Icon after student done lesson move to green.
<img width="1911" height="954" alt="image" src="https://github.com/user-attachments/assets/be8c224f-fd2d-40fb-8973-4d7530724871" />


- **Chat with instructor**: They also can chat with their instuctor
<img width="1907" height="946" alt="image" src="https://github.com/user-attachments/assets/cc9e7d84-1d9f-450b-8003-a693e8777084" />

Back to Backend, api document I saved in this Google Doc. If you want to check my api, please access this:
https://docs.google.com/document/d/1Wx8SMe91fereyV-xictBxUaVFkEiWtxg1t1HpqiMTFs/edit?usp=sharing

## Final Notes
This website is still missing many important features and does not fully meet the challenge requirements. However, I’ve approached this task with a serious attitude and invested genuine effort into its development.

Thank you so much for reviewing my work.

If you have any questions or need help running the app, feel free to reach out.
Contact: vytq3107forwork@gmail.com


