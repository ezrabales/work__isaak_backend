# Plumbing Tech

Plumbing Tech is a full-stack web application that helps plumbers manage jobs, track invoices, upload job photos, and email professional PDF invoices from a single dashboard.

## Features

- Create, edit, and manage plumbing jobs
- Generate and email professional PDF invoices
- Upload and manage job photos
- Track invoice and payment status
- Monitor invoiced vs. received revenue
- Build custom invoices with an intuitive editor

## Built With

### Frontend
- React
- JavaScript
- HTML
- CSS

### Backend
- Node.js
- Express
- MongoDB

### Other Tools
- JWT Authentication
- Cloudinary

## Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

## Live Demo

Website: [Plumbing Tech](https://www.plumbingtech.app/)

Demo Account

Email:
```
tester@test.com
```

Password:
```
asdf
```

## Installation

Clone the repository

```bash
git clone https://github.com/ezrabales/work__isaak_backend.git
```

Navigate to the project

```bash
cd Isaak_Backend
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm start
```

## Environment Variables

Create a `.env` file with the following values:

```env
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
EMAILJS_PRIVATE_KEY=
MONGO_URI=
RESEND_API_KEY=
REGISTER_KEY=
```

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /signin | Sign in |
| POST | /signup | Create account |
| GET | /users/me | Authorize token |
| GET | /users/rate | Get hourly rate |
| PATCH | /users/rate | Update hourly rate |
| PATCH | /users/me | Update user |
| PATCH | /users/me/password | Update password |
| POST | /email/ezra | Send message to developer |
| POST | /invoice/:jobId | Send invoice to customer |
| GET | /invoice/:invoiceNumber | Show sent invoice to user |
| POST | /jobs | Create a new job |
| GET | /jobs | Get all jobs |
| PATCH | /jobs/:jobId | Update job |
| PATCH | /jobs/status/:jobId | Update job status |
| DELETE | /jobs/:jobId/:invoiceNumber | Delete job |
| POST | /parts | Create a new part |
| GET | /parts | Get all parts |
| PATCH | /parts/:partId | Update part |
| DELETE | /parts/:partId | Delete part |
| POST | /pictures | Upload new picture |
| GET | /pictures/:invoiceNumber | Get all pictures for job |
| DELETE | /pictures/:pictureId | Delete picture |

## Future Improvements

- [ ] Make UI fully mobile friendly
- [ ] Add a home page describing the project
- [ ] Allow users to pay for access

## Lessons Learned

This project helped me strengthen my understanding of component-based architecture, as well as writing modular and reusable code. I also gained experience generating professional PDF documents using JS, and sending automated emails with attachements. 

## Author

**Ezra Bales**

GitHub: https://github.com/ezrabales

LinkedIn: https://www.linkedin.com/in/ezra-bales-9880a9327
