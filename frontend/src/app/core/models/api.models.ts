/* ── Auth ── */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: 'TEACHER' | 'STUDENT';
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: string;
  email: string;
  fullName: string;
  role: AppRole;
}

export type AppRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT';

/* ── User ── */
export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  role: AppRole;
  status: 'ACTIVE' | 'DEACTIVATED';
  teacherVerified: boolean;
  createdAt: string;
}

/* ── Subject ── */
export interface SubjectDto {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface CreateSubjectRequest {
  name: string;
  description?: string;
}

export interface UpdateSubjectRequest {
  name: string;
  description?: string;
}

/* ── Question ── */
export interface QuestionOptionRequest {
  optionText: string;
  isCorrect: boolean;
  optionOrder: number;
}

export interface QuestionCreateRequest {
  subjectId?: string;
  year?: number;
  paperId?: string;
  questionText: string;
  options: QuestionOptionRequest[];
}

export interface QuestionUpdateRequest {
  questionText: string;
  options: QuestionOptionRequest[];
}

export interface QuestionRejectRequest {
  reason: string;
}

export interface QuestionOptionDto {
  id: string;
  optionText: string;
  optionOrder: number;
  isCorrect: boolean | null;
}

export interface QuestionDto {
  id: string;
  subjectId: string;
  subjectName: string;
  year: number;
  paperId?: string;
  questionText: string;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  approvedByEmail?: string;
  approvedAt?: string;
  version: number;
  options: QuestionOptionDto[];
  createdByEmail: string;
  createdAt: string;
  updatedAt: string;
}

/* ── Paper ── */
export type PaperType = 'PAST_PAPER' | 'PRACTICE';
export type PaperStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED';

export interface PaperDto {
  id: string;
  year: number | null;
  subjectId: string;
  subjectName: string;
  durationSeconds: number;
  questionCount: number;
  assignedQuestions: number;
  paperType: PaperType;
  title?: string;
  status: PaperStatus;
  createdByEmail?: string;
  createdByName?: string;
}

export interface PaperDetailDto {
  id: string;
  year: number | null;
  subjectId: string;
  subjectName: string;
  durationSeconds: number;
  questionCount: number;
  paperType: PaperType;
  title?: string;
  status: PaperStatus;
  questions: PaperQuestionInfo[];
}

export interface PaperQuestionInfo {
  position: number;
  questionId: string;
  questionText: string;
  options: PaperOptionInfo[];
}

export interface PaperOptionInfo {
  id: string;
  optionText: string;
  optionOrder: number;
  isCorrect: boolean;
}

export interface PaperCreateRequest {
  year?: number;
  subjectId: string;
  questionCount: number;
  durationSeconds: number;
  title?: string;
}

export interface PaperRejectRequest {
  reason: string;
}

export interface PaperUpdateRequest {
  questionCount: number;
  durationSeconds: number;
}

export interface PaperQuestionCreateRequest {
  questionText: string;
  options: QuestionOptionRequest[];
}

export interface PaperQuestionAssignRequest {
  questionId: string;
  position: number;
}

/* ── Attempt ── */
export interface AttemptStartResponse {
  attemptId: string;
  attemptNo: number;
  year: number;
  subjectName: string;
  totalQuestions: number;
  durationSeconds: number;
  startedAt: string;
  expiresAt: string;
}

export interface NextQuestionResponse {
  attemptExpired: boolean;
  allQuestionsAnswered: boolean;
  questionNumber?: number;
  totalQuestions?: number;
  questionId?: string;
  questionText?: string;
  options?: QuestionOptionDto[];
  remainingSecondsTotal?: number;
  remainingSecondsForQuestion?: number;
  message?: string;
}

export interface AnswerRequest {
  questionId: string;
  selectedOptionId: string;
}

export interface AnswerResponse {
  acknowledged: boolean;
  wasTimeout: boolean;
  attemptExpired: boolean;
  message: string;
}

export interface AttemptResultResponse {
  attemptId: string;
  attemptNo: number;
  status: string;
  year: number;
  subjectName: string;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  score: number;
  totalQuestions: number;
  startedAt: string;
  submittedAt: string;
  scoreMessage: string;
  previousBestScore?: number;
  isNewBest: boolean;
  comparisonMessage?: string;
}

/* ── Paged ── */
export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

/* ── API Error ── */
export interface ApiError {
  status: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
  fieldErrors?: FieldError[];
}

export interface FieldError {
  field: string;
  message: string;
  rejectedValue: any;
}

/* ── Student Attempt Viewing (Admin/Teacher) ── */
export interface StudentAttemptSummaryDto {
  attemptId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  paperId: string;
  year: number;
  subjectName: string;
  attemptNo: number;
  status: string;
  correctCount: number;
  wrongCount: number;
  score: number;
  totalQuestions: number;
  paperType: string;
  paperTitle: string;
  startedAt: string;
  submittedAt: string;
}

export interface AttemptDetailDto {
  attemptId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  year: number;
  subjectName: string;
  attemptNo: number;
  status: string;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  score: number;
  totalQuestions: number;
  startedAt: string;
  submittedAt: string;
  answers: AttemptAnswerDetailDto[];
}

export interface AttemptAnswerDetailDto {
  questionNumber: number;
  questionId: string;
  questionText: string;
  options: OptionDetail[];
  selectedOptionId: string | null;
  selectedOptionText: string | null;
  selectedOptionOrder: number | null;
  isCorrect: boolean;
  isTimeout: boolean;
  isUnanswered: boolean;
  timeTakenSeconds: number | null;
  answeredAt: string | null;
}

export interface OptionDetail {
  id: string;
  optionText: string;
  optionOrder: number;
  isCorrect: boolean;
  isSelected: boolean;
}

/* ── Public Stats ── */
export interface PublicStats {
  studentCount: number;
  teacherCount: number;
  paperCount: number;
  subjectCount: number;
}

/* ── User Management ── */
export interface UserUpdateRequest {
  fullName: string;
  email: string;
  role: AppRole;
  status: 'ACTIVE' | 'DEACTIVATED';
  teacherVerified: boolean;
}

export interface ResetPasswordRequest {
  newPassword: string;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role: AppRole;
}
