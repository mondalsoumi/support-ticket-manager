# SupportDesk — AI-Powered Support Ticket Manager

A full-stack support ticket management system where every ticket is automatically classified, prioritized, and responded to using Google Gemini AI.

**Live demo:** [support-ticket-manager-final.vercel.app](https://support-ticket-manager-final.vercel.app)

---

## What it does

Customers submit support tickets in plain language. The moment a ticket is created, Google Gemini reads the description and automatically assigns:
- **Category** (billing, technical, general, complaint, other)
- **Priority** (low, medium, high, urgent)
- **A suggested reply** for the support agent to use as a starting point

Support agents and admins then manage, update, and respond to tickets through a clean dashboard — with full analytics showing ticket volume by category and priority split.

---

## Features

- **AI classification** — every ticket auto-triaged by Gemini on submission
- **Role-based access control** — customer / support / admin tiers with JWT auth
- **Admin panel** — sortable, filterable table of all tickets with inline status updates
- **Analytics dashboard** — bar chart and pie chart powered by Recharts
- **Comments thread** — customers and agents communicate on each ticket
- **Forgot password** — security-question based password recovery
- **Protected routes** — frontend and backend both enforce access control independently

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router, Tailwind CSS, Recharts |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| AI | Google Gemini API (`gemini-2.5-flash`) |
| Auth | JWT, bcrypt |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project structure

```
support-ticket-manager/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── middleware/       # JWT auth + role checks
│   ├── models/           # Mongoose schemas (User, Ticket, Comment)
│   ├── routes/           # API endpoints
│   ├── utils/            # Gemini AI classifier
│   └── server.js
└── frontend/
    └── src/
        ├── api/          # Axios instance with interceptor
        ├── components/   # Reusable UI (Navbar, badges, forms, table)
        ├── context/      # Auth context with localStorage persistence
        └── pages/        # Landing, Login, Register, Dashboard, Admin, Analytics
```

---

## API endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/security-question` | Fetch security question for email |
| POST | `/api/auth/verify-security-answer` | Verify answer, get reset token |
| POST | `/api/auth/reset-password` | Set new password with reset token |

### Tickets
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tickets` | Create ticket (triggers AI) |
| GET | `/api/tickets` | Get own tickets |
| GET | `/api/tickets/all` | Get all tickets (admin only) |
| GET | `/api/tickets/:id` | Get single ticket |
| PATCH | `/api/tickets/:id` | Update ticket status (admin only) |

### Comments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tickets/:id/comments` | Add comment |
| GET | `/api/tickets/:id/comments` | Get all comments for ticket |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| PATCH | `/api/users/:id/role` | Update user role (admin only) |
| GET | `/api/analytics/summary` | Ticket stats by status/category/priority |

---

## Running locally

### Prerequisites
- Node.js v18+
- A MongoDB Atlas account (free tier)
- A Google AI Studio API key (free tier)

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:
```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=any_long_random_string
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Make sure `frontend/src/api/axios.js` has `baseURL: 'http://localhost:5000/api'` for local development.

---

## Key design decisions

**AI as infrastructure, not a feature** — the Gemini call is embedded directly in the ticket creation flow, not a separate optional step. If the AI fails (rate limit, outage), the ticket still saves with sensible defaults. The support team's workflow never breaks because of a third-party dependency.

**Single `module.exports` rule** — a subtle Node.js pitfall discovered during build: calling `module.exports` twice in one file silently overwrites the first. All modules export once at the bottom.

**Separation of "my tickets" vs "all tickets"** — `GET /api/tickets` always returns the logged-in user's own tickets regardless of role. `GET /api/tickets/all` is a separate admin-only endpoint. This prevents a logged-in admin from seeing everyone's tickets on their personal dashboard.

**Security answer normalization** — security answers are lowercased and trimmed before hashing so "Mumbai", "MUMBAI", and " mumbai " all match correctly during verification.

---

## What I'd add next

- Email-based password reset (Nodemailer + Resend)
- Real-time ticket updates using WebSockets
- SLA tracking with auto-escalation on breach
- Ticket assignment to specific support agents
- Customer satisfaction rating after resolution
- Mobile app using React Native

---

## Author

Built by [Soumi Mondal](https://github.com/mondalsoumi) as a full-stack learning project — backend to frontend, authentication to AI integration, local development to production deployment.