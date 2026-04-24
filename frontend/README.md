# පිරිවෙන් MCQ — Frontend

Sri Lankan Government-School Past-Paper MCQ System built with **Angular 16** + **Angular Material 16**.

## Quick Start

```bash
cd frontend
npm install
npm start          # http://localhost:4200
```

Backend API must be running at `http://localhost:8080` (Spring Boot + PostgreSQL).

## Seed Accounts

| Role        | Email                    | Password         |
| ----------- | ------------------------ | ---------------- |
| Super Admin | `superadmin@piriven.com` | `SuperAdmin@123` |
| Admin       | `admin@piriven.com`      | `Admin@123`      |

Register new Teacher or Student accounts via the registration page.

## Architecture

```
src/app/
├── core/               # Singleton services, guards, interceptors, models
│   ├── models/         # All TypeScript interfaces matching backend DTOs
│   ├── services/       # AuthService, ApiService, NotificationService
│   ├── guards/         # AuthGuard, RoleGuard
│   └── interceptors/   # JwtInterceptor, ErrorInterceptor
├── shared/             # SharedModule (Material imports + reusable components)
│   └── components/     # PageHeader, EmptyState, ConfirmDialog, LoadingOverlay, TimerDisplay
├── layout/             # Shell layout (Navbar, Sidebar, Shell wrapper)
└── features/
    ├── auth/           # Landing, Login, Register
    ├── student/        # Dashboard, Years, Papers, Exam, Result
    ├── teacher/        # Dashboard, QuestionCreate, QuestionList, QuestionDetail
    ├── admin/          # Dashboard, PendingApprovals, UserManagement, SubjectManagement, PaperManagement
    └── superadmin/     # Dashboard, Questions (CRUD), Users (delete)
```

## Roles & Routes

| Role        | Base Route    | Features                                                                  |
| ----------- | ------------- | ------------------------------------------------------------------------- |
| STUDENT     | `/student`    | Browse years → papers → take exam → view result                           |
| TEACHER     | `/teacher`    | Create/edit questions, submit for review, track status                    |
| ADMIN       | `/admin`      | Approve/reject questions, manage users & subjects, assign paper questions |
| SUPER_ADMIN | `/superadmin` | Full CRUD on all questions, delete users                                  |

## Tech Stack

- Angular 16 (module-based, lazy-loaded features)
- Angular Material 16 (MDC components)
- SCSS with custom Deep Blue (#0B3D91) + Golden Yellow (#F4B400) theme
- Noto Sans Sinhala font (Sinhala-first UI)
- JWT auth via localStorage
- RxJS for state & timer management

## Build

```bash
npm run build          # Production build → dist/piriven-mcq/
```

## API Base URL

Change in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: "http://localhost:8080",
};
```
