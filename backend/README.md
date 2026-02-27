# MCQ Past Paper System - Backend

A production-grade Spring Boot backend for an MCQ past-paper examination system with role-based access control (RBAC), server-side exam timing enforcement, and a question approval workflow.

## Tech Stack

- **Java 21**, **Spring Boot 3.2.x**
- **Spring Security** with JWT authentication
- **PostgreSQL 16** with pgcrypto extension
- **Flyway** for database migrations
- **Docker Compose** for orchestration
- **Maven** for build management
- **Lombok** for boilerplate reduction

## Architecture

Modular monolith with clean layering:

```
Controller → Service → Repository → PostgreSQL
     ↑           ↑
    DTOs     Entities
```

### Package Structure

```
com.piriven.mcq
├── config/          # Security configuration
├── security/        # JWT provider, filter, UserPrincipal
├── common/          # Global exception handler, DTOs
├── auth/            # Registration & login
├── user/            # User management (RBAC)
├── subject/         # Subject CRUD & teacher assignment
├── question/        # Question CRUD, approval workflow
├── paper/           # Paper management, question assignment
└── attempt/         # Exam engine with timing enforcement
```

## Roles & Permissions

| Role            | Permissions                                                                   |
| --------------- | ----------------------------------------------------------------------------- |
| **SUPER_ADMIN** | Create/update/delete ANY question (override), delete users                    |
| **ADMIN**       | Approve/reject questions, deactivate users, verify teachers                   |
| **TEACHER**     | Create questions (for assigned subjects, must be verified), submit for review |
| **STUDENT**     | Attempt papers, answer questions, view results (max 10 attempts per paper)    |

## Quick Start

### Using Docker Compose (Recommended)

```bash
cd backend
docker compose up --build
```

This starts:

- **PostgreSQL** on port `5432`
- **pgAdmin** on port `5050` (login: admin@piriven.com / admin)
- **Backend API** on port `8080`

Flyway migrations run automatically on startup.

### Local Development

1. Start PostgreSQL:

```bash
docker compose up postgres pgadmin
```

2. Run the Spring Boot app:

```bash
./mvnw spring-boot:run
```

Or with Maven:

```bash
mvn spring-boot:run
```

### Default Accounts (Seeded via Flyway)

| Email                  | Password       | Role        |
| ---------------------- | -------------- | ----------- |
| superadmin@piriven.com | SuperAdmin@123 | SUPER_ADMIN |
| admin@piriven.com      | Admin@123      | ADMIN       |

> **Note**: ADMIN and SUPER_ADMIN cannot be registered publicly. Only TEACHER and STUDENT can self-register.

## Exam Timing Rules

### Total Attempt Duration

- **20 minutes (1200 seconds)** per attempt
- Server enforces `expires_at = started_at + 1200s`
- If any request comes after `expires_at`, the attempt is automatically marked **EXPIRED**

### Per-Question Timer

- **30 seconds** per question from the moment it is served
- Server tracks `question_deadline = served_at + 30s`
- If answer submitted after deadline → marked as **timeout/wrong**
- If student calls `next-question` and previous question timed out → auto-marks as timeout and serves next

### Attempt Flow

1. Student selects year → sees 9 papers
2. Starts attempt for a paper → server creates attempt with timers
3. Calls `next-question` → server returns ONE question at a time (no bulk list)
4. Submits answer → server validates timing and records
5. Repeats 3-4 for all 40 questions
6. Calls `submit` → server finalizes and computes result
7. Gets result with Sinhala encouragement messages

## API Reference

### Authentication

```http
### Register (TEACHER or STUDENT only)
POST /api/auth/register
Content-Type: application/json

{
  "email": "teacher@example.com",
  "password": "MySecurePass123",
  "fullName": "John Doe",
  "role": "TEACHER"
}

### Login
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@piriven.com",
  "password": "Admin@123"
}
```

### Admin Operations

```http
### Deactivate User (ADMIN)
PATCH /api/admin/users/{userId}/deactivate
Authorization: Bearer <admin-token>

### Verify Teacher (ADMIN)
PATCH /api/admin/teachers/{teacherId}/verify
Authorization: Bearer <admin-token>

### Delete User (SUPER_ADMIN only)
DELETE /api/superadmin/users/{userId}
Authorization: Bearer <superadmin-token>
```

### Subjects

```http
### List All Subjects (any authenticated user)
GET /api/subjects
Authorization: Bearer <token>

### Create Subject (ADMIN)
POST /api/admin/subjects
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Buddhist Studies",
  "description": "Core Buddhist studies curriculum"
}

### Assign Subject to Teacher (ADMIN)
POST /api/admin/teachers/{teacherId}/subjects/{subjectId}
Authorization: Bearer <admin-token>
```

### Teacher Questions

```http
### Create Question (TEACHER, verified, assigned to subject)
POST /api/teacher/questions
Authorization: Bearer <teacher-token>
Content-Type: application/json

{
  "subjectId": "<subject-uuid>",
  "questionText": "බුද්ධ ධර්මයේ ත්‍රිපිටකයේ විනය පිටකයට අයත් වන්නේ?",
  "options": [
    {"optionText": "සුත්ත පිටකය", "isCorrect": false, "optionOrder": 1},
    {"optionText": "විනය පිටකය", "isCorrect": true, "optionOrder": 2},
    {"optionText": "අභිධම්ම පිටකය", "isCorrect": false, "optionOrder": 3},
    {"optionText": "ජාතක කථා", "isCorrect": false, "optionOrder": 4}
  ]
}

### Update Question (TEACHER, own question, not APPROVED)
PUT /api/teacher/questions/{questionId}
Authorization: Bearer <teacher-token>
Content-Type: application/json

{
  "questionText": "Updated question text",
  "options": [
    {"optionText": "Option A", "isCorrect": false, "optionOrder": 1},
    {"optionText": "Option B", "isCorrect": true, "optionOrder": 2},
    {"optionText": "Option C", "isCorrect": false, "optionOrder": 3},
    {"optionText": "Option D", "isCorrect": false, "optionOrder": 4}
  ]
}

### Submit for Review (TEACHER)
POST /api/teacher/questions/{questionId}/submit
Authorization: Bearer <teacher-token>

### List My Questions (TEACHER)
GET /api/teacher/questions?page=0&size=20
Authorization: Bearer <teacher-token>
```

### Admin Question Review

```http
### List Pending Questions (ADMIN)
GET /api/admin/questions/pending?page=0&size=20
Authorization: Bearer <admin-token>

### Approve Question (ADMIN)
POST /api/admin/questions/{questionId}/approve
Authorization: Bearer <admin-token>

### Reject Question (ADMIN)
POST /api/admin/questions/{questionId}/reject
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "reason": "Question text is unclear. Please revise."
}
```

### Super Admin Questions

```http
### Create Question (auto-APPROVED)
POST /api/superadmin/questions
Authorization: Bearer <superadmin-token>
Content-Type: application/json

{
  "subjectId": "<subject-uuid>",
  "questionText": "...",
  "options": [...]
}

### Update ANY Question
PUT /api/superadmin/questions/{questionId}
Authorization: Bearer <superadmin-token>

### Delete ANY Question
DELETE /api/superadmin/questions/{questionId}
Authorization: Bearer <superadmin-token>
```

### Papers

```http
### List Available Years
GET /api/papers/years
Authorization: Bearer <token>

### List Papers by Year
GET /api/papers?year=2024
Authorization: Bearer <token>

### Assign Question to Paper (ADMIN)
POST /api/admin/papers/{paperId}/questions
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "questionId": "<approved-question-uuid>",
  "position": 1
}

### Get Paper Detail (ADMIN)
GET /api/admin/papers/{paperId}
Authorization: Bearer <admin-token>
```

### Exam Engine (Student)

```http
### Start Attempt
POST /api/student/papers/{paperId}/attempts/start
Authorization: Bearer <student-token>

### Get Next Question (returns ONE question at a time)
GET /api/student/attempts/{attemptId}/next-question
Authorization: Bearer <student-token>

### Submit Answer
POST /api/student/attempts/{attemptId}/answer
Authorization: Bearer <student-token>
Content-Type: application/json

{
  "questionId": "<question-uuid>",
  "selectedOptionId": "<option-uuid>"
}

### Submit Attempt (finalize)
POST /api/student/attempts/{attemptId}/submit
Authorization: Bearer <student-token>

### Get Result
GET /api/student/attempts/{attemptId}/result
Authorization: Bearer <student-token>
```

### Sample Result Response

```json
{
  "attemptId": "...",
  "attemptNo": 1,
  "status": "SUBMITTED",
  "year": 2024,
  "paperNo": 1,
  "correctCount": 36,
  "wrongCount": 4,
  "unansweredCount": 0,
  "score": 36,
  "totalQuestions": 40,
  "startedAt": "2025-01-15T10:00:00",
  "submittedAt": "2025-01-15T10:18:30",
  "scoreMessage": "ඉතා විශිෂ්ටයි! ඔබ ඉතා දක්ෂ ශිෂ්‍යයෙකි. මෙම විශිෂ්ට ප්‍රතිඵලය ගැන අපි ඔබට සුබ පතමු! ...",
  "previousBestScore": 32,
  "isNewBest": true,
  "comparisonMessage": "සුබ පැතුම්! ඔබේ පෙර හොඳම ලකුණු වාර්තාව (32/40) ඉක්මවා ඇත! නව හොඳම ලකුණු: 36/40 🎉"
}
```

## Data Integrity

### Application Level

- Exactly 4 options per question (validated on create/update)
- Exactly 1 correct option per question
- Paper must have 40 assigned questions before students can attempt

### Database Level

- **Trigger** `trg_validate_question_approval`: Validates 4 options with 1 correct before status can change to APPROVED
- **Trigger** `trg_check_max_options`: Prevents inserting more than 4 options per question
- **Trigger** `trg_check_single_correct`: Prevents more than 1 correct option per question
- **UNIQUE constraints**: `(question_id, option_order)`, `(paper_id, position)`, `(student_id, paper_id, attempt_no)`
- **CHECK constraints**: option_order 1-4, position 1-40, attempt_no 1-10

## Environment Variables

| Variable       | Default    | Description                       |
| -------------- | ---------- | --------------------------------- |
| DB_HOST        | localhost  | PostgreSQL host                   |
| DB_PORT        | 5432       | PostgreSQL port                   |
| DB_NAME        | mcq_db     | Database name                     |
| DB_USERNAME    | mcq_user   | Database user                     |
| DB_PASSWORD    | mcq_pass   | Database password                 |
| JWT_SECRET     | (built-in) | JWT signing secret (min 64 chars) |
| JWT_EXPIRATION | 86400000   | Token expiry in ms (24h)          |
| SERVER_PORT    | 8080       | Application port                  |

## Question Workflow

```
DRAFT → PENDING_REVIEW → APPROVED → (assigned to paper)
                       ↘ REJECTED → (teacher edits) → DRAFT → ...
```

## Score Messages (Sinhala)

| Score Range | Message Theme                                                       |
| ----------- | ------------------------------------------------------------------- |
| > 35/40     | ඉතා විශිෂ්ටයි! (Highly praising)                                    |
| 30-35/40    | හොඳයි! තව උනන්දු වී පාඩම් කළ යුතුයි (Normal praise + encouragement) |
| < 30/40     | අධෛර්ය නොවන්න! තව මහන්සි වී පාඩම් කළ යුතුයි (Encouraging)           |
