import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  SubjectDto,
  PaperDto,
  AttemptStartResponse,
  NextQuestionResponse,
  AnswerRequest,
  AnswerResponse,
  AttemptResultResponse,
  QuestionCreateRequest,
  QuestionUpdateRequest,
  QuestionDto,
  QuestionRejectRequest,
  PagedResponse,
  UserDto,
  CreateSubjectRequest,
  UpdateSubjectRequest,
  PaperDetailDto,
  PaperQuestionAssignRequest,
  PaperCreateRequest,
  PaperUpdateRequest,
  PaperQuestionCreateRequest,
  PaperRejectRequest,
  UserUpdateRequest,
  ResetPasswordRequest,
  CreateUserRequest,
  StudentAttemptSummaryDto,
  AttemptDetailDto,
  PublicStats,
} from '../models';

const BASE = environment.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  /* ── Public ── */
  getPublicStats(): Observable<PublicStats> {
    return this.http.get<PublicStats>(`${BASE}/api/public/stats`);
  }

  /* ── Subjects ── */
  getSubjects(): Observable<SubjectDto[]> {
    return this.http.get<SubjectDto[]>(`${BASE}/api/subjects`);
  }

  getMySubjects(): Observable<SubjectDto[]> {
    return this.http.get<SubjectDto[]>(`${BASE}/api/teacher/subjects`);
  }

  /* ── Teacher / Papers (read-only, for question assignment) ── */
  getTeacherPapers(): Observable<PaperDto[]> {
    return this.http.get<PaperDto[]>(`${BASE}/api/teacher/papers`);
  }

  getTeacherPapersBySubject(subjectId: string): Observable<PaperDto[]> {
    return this.http.get<PaperDto[]>(`${BASE}/api/teacher/papers`, {
      params: { subjectId },
    });
  }

  /* ── Papers ── */
  getYears(): Observable<number[]> {
    return this.http.get<number[]>(`${BASE}/api/papers/years`);
  }

  getPapersByYear(year: number): Observable<PaperDto[]> {
    return this.http.get<PaperDto[]>(`${BASE}/api/papers`, {
      params: { year: year.toString() },
    });
  }

  /* ── Student / Attempts ── */
  startAttempt(paperId: string): Observable<AttemptStartResponse> {
    return this.http.post<AttemptStartResponse>(
      `${BASE}/api/student/papers/${paperId}/attempts/start`,
      {},
    );
  }

  getNextQuestion(attemptId: string): Observable<NextQuestionResponse> {
    return this.http.get<NextQuestionResponse>(
      `${BASE}/api/student/attempts/${attemptId}/next-question`,
    );
  }

  submitAnswer(
    attemptId: string,
    req: AnswerRequest,
  ): Observable<AnswerResponse> {
    return this.http.post<AnswerResponse>(
      `${BASE}/api/student/attempts/${attemptId}/answer`,
      req,
    );
  }

  submitAttempt(attemptId: string): Observable<AttemptResultResponse> {
    return this.http.post<AttemptResultResponse>(
      `${BASE}/api/student/attempts/${attemptId}/submit`,
      {},
    );
  }

  getAttemptResult(attemptId: string): Observable<AttemptResultResponse> {
    return this.http.get<AttemptResultResponse>(
      `${BASE}/api/student/attempts/${attemptId}/result`,
    );
  }

  /* ── Teacher / Questions ── */
  createQuestion(req: QuestionCreateRequest): Observable<QuestionDto> {
    return this.http.post<QuestionDto>(`${BASE}/api/teacher/questions`, req);
  }

  updateQuestion(
    id: string,
    req: QuestionUpdateRequest,
  ): Observable<QuestionDto> {
    return this.http.put<QuestionDto>(
      `${BASE}/api/teacher/questions/${id}`,
      req,
    );
  }

  submitQuestion(id: string): Observable<QuestionDto> {
    return this.http.post<QuestionDto>(
      `${BASE}/api/teacher/questions/${id}/submit`,
      {},
    );
  }

  getMyQuestions(page = 0, size = 20): Observable<PagedResponse<QuestionDto>> {
    return this.http.get<PagedResponse<QuestionDto>>(
      `${BASE}/api/teacher/questions`,
      {
        params: new HttpParams().set('page', page).set('size', size),
      },
    );
  }

  getQuestion(id: string): Observable<QuestionDto> {
    return this.http.get<QuestionDto>(`${BASE}/api/teacher/questions/${id}`);
  }

  assignPaperToQuestion(
    questionId: string,
    paperId: string,
  ): Observable<QuestionDto> {
    return this.http.patch<QuestionDto>(
      `${BASE}/api/teacher/questions/${questionId}/paper`,
      { paperId },
    );
  }

  /* ── Teacher / Student Attempts ── */
  getTeacherStudentAttempts(
    page = 0,
    size = 20,
  ): Observable<PagedResponse<StudentAttemptSummaryDto>> {
    return this.http.get<PagedResponse<StudentAttemptSummaryDto>>(
      `${BASE}/api/teacher/student-attempts`,
      {
        params: new HttpParams().set('page', page).set('size', size),
      },
    );
  }

  getTeacherStudentAttemptsByPaper(
    paperId: string,
    page = 0,
    size = 20,
  ): Observable<PagedResponse<StudentAttemptSummaryDto>> {
    return this.http.get<PagedResponse<StudentAttemptSummaryDto>>(
      `${BASE}/api/teacher/student-attempts/by-paper/${paperId}`,
      {
        params: new HttpParams().set('page', page).set('size', size),
      },
    );
  }

  getTeacherAttemptDetail(attemptId: string): Observable<AttemptDetailDto> {
    return this.http.get<AttemptDetailDto>(
      `${BASE}/api/teacher/student-attempts/${attemptId}/detail`,
    );
  }

  /* ── Admin / Questions ── */
  getPendingQuestions(
    page = 0,
    size = 20,
  ): Observable<PagedResponse<QuestionDto>> {
    return this.http.get<PagedResponse<QuestionDto>>(
      `${BASE}/api/admin/questions/pending`,
      {
        params: new HttpParams().set('page', page).set('size', size),
      },
    );
  }

  approveQuestion(id: string): Observable<QuestionDto> {
    return this.http.post<QuestionDto>(
      `${BASE}/api/admin/questions/${id}/approve`,
      {},
    );
  }

  rejectQuestion(
    id: string,
    req: QuestionRejectRequest,
  ): Observable<QuestionDto> {
    return this.http.post<QuestionDto>(
      `${BASE}/api/admin/questions/${id}/reject`,
      req,
    );
  }

  /* ── Admin / Users ── */
  createUser(req: CreateUserRequest): Observable<UserDto> {
    return this.http.post<UserDto>(`${BASE}/api/admin/users`, req);
  }

  getUsers(page = 0, size = 50): Observable<PagedResponse<UserDto>> {
    return this.http.get<PagedResponse<UserDto>>(`${BASE}/api/admin/users`, {
      params: new HttpParams().set('page', page).set('size', size),
    });
  }

  deactivateUser(id: string): Observable<UserDto> {
    return this.http.patch<UserDto>(
      `${BASE}/api/admin/users/${id}/deactivate`,
      {},
    );
  }

  verifyTeacher(id: string): Observable<UserDto> {
    return this.http.patch<UserDto>(
      `${BASE}/api/admin/teachers/${id}/verify`,
      {},
    );
  }

  updateUser(id: string, req: UserUpdateRequest): Observable<UserDto> {
    return this.http.put<UserDto>(`${BASE}/api/admin/users/${id}`, req);
  }

  resetPassword(id: string, req: ResetPasswordRequest): Observable<void> {
    return this.http.post<void>(
      `${BASE}/api/admin/users/${id}/reset-password`,
      req,
    );
  }

  activateUser(id: string): Observable<UserDto> {
    return this.http.patch<UserDto>(
      `${BASE}/api/admin/users/${id}/activate`,
      {},
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE}/api/admin/users/${id}`);
  }

  /* ── Admin / Subjects ── */
  createSubject(req: CreateSubjectRequest): Observable<SubjectDto> {
    return this.http.post<SubjectDto>(`${BASE}/api/admin/subjects`, req);
  }

  updateSubject(id: string, req: UpdateSubjectRequest): Observable<SubjectDto> {
    return this.http.put<SubjectDto>(`${BASE}/api/admin/subjects/${id}`, req);
  }

  deleteSubject(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE}/api/admin/subjects/${id}`);
  }

  assignSubjectToTeacher(
    teacherId: string,
    subjectId: string,
  ): Observable<any> {
    return this.http.post(
      `${BASE}/api/admin/teachers/${teacherId}/subjects/${subjectId}`,
      {},
    );
  }

  /* ── Admin / Papers ── */
  createPaper(req: PaperCreateRequest): Observable<PaperDto> {
    return this.http.post<PaperDto>(`${BASE}/api/admin/papers`, req);
  }

  getPaperDetail(paperId: string): Observable<PaperDetailDto> {
    return this.http.get<PaperDetailDto>(`${BASE}/api/admin/papers/${paperId}`);
  }

  updatePaper(paperId: string, req: PaperUpdateRequest): Observable<PaperDto> {
    return this.http.put<PaperDto>(`${BASE}/api/admin/papers/${paperId}`, req);
  }

  deletePaper(paperId: string): Observable<void> {
    return this.http.delete<void>(`${BASE}/api/admin/papers/${paperId}`);
  }

  assignQuestionToPaper(
    paperId: string,
    req: PaperQuestionAssignRequest,
  ): Observable<any> {
    return this.http.post(`${BASE}/api/admin/papers/${paperId}/questions`, req);
  }

  createQuestionForPaper(
    paperId: string,
    req: PaperQuestionCreateRequest,
  ): Observable<PaperDetailDto> {
    return this.http.post<PaperDetailDto>(
      `${BASE}/api/admin/papers/${paperId}/questions/create`,
      req,
    );
  }

  removeQuestionFromPaper(
    paperId: string,
    questionId: string,
  ): Observable<void> {
    return this.http.delete<void>(
      `${BASE}/api/admin/papers/${paperId}/questions/${questionId}`,
    );
  }

  /* ── Admin / Practice Paper Approvals ── */
  getPendingPracticePapers(
    page = 0,
    size = 20,
  ): Observable<PagedResponse<PaperDto>> {
    return this.http.get<PagedResponse<PaperDto>>(
      `${BASE}/api/admin/papers/practice/pending`,
      {
        params: new HttpParams().set('page', page).set('size', size),
      },
    );
  }

  approvePracticePaper(paperId: string): Observable<PaperDto> {
    return this.http.post<PaperDto>(
      `${BASE}/api/admin/papers/practice/${paperId}/approve`,
      {},
    );
  }

  rejectPracticePaper(
    paperId: string,
    req: PaperRejectRequest,
  ): Observable<PaperDto> {
    return this.http.post<PaperDto>(
      `${BASE}/api/admin/papers/practice/${paperId}/reject`,
      req,
    );
  }

  /* ── Teacher / Practice Papers ── */
  createPracticePaper(req: PaperCreateRequest): Observable<PaperDto> {
    return this.http.post<PaperDto>(`${BASE}/api/teacher/papers/practice`, req);
  }

  getTeacherPracticePapers(
    page = 0,
    size = 20,
  ): Observable<PagedResponse<PaperDto>> {
    return this.http.get<PagedResponse<PaperDto>>(
      `${BASE}/api/teacher/papers/practice`,
      {
        params: new HttpParams().set('page', page).set('size', size),
      },
    );
  }

  getTeacherPracticePaperDetail(paperId: string): Observable<PaperDetailDto> {
    return this.http.get<PaperDetailDto>(
      `${BASE}/api/teacher/papers/practice/${paperId}`,
    );
  }

  submitPracticePaperForApproval(paperId: string): Observable<PaperDto> {
    return this.http.post<PaperDto>(
      `${BASE}/api/teacher/papers/practice/${paperId}/submit`,
      {},
    );
  }

  /* ── Student / Practice Papers ── */
  getPracticeSubjects(): Observable<SubjectDto[]> {
    return this.http.get<SubjectDto[]>(`${BASE}/api/papers/practice/subjects`);
  }

  getPracticePapersBySubject(subjectId: string): Observable<PaperDto[]> {
    return this.http.get<PaperDto[]>(`${BASE}/api/papers/practice`, {
      params: { subjectId },
    });
  }

  /* ── Super Admin / Questions ── */
  superGetQuestions(
    page = 0,
    size = 20,
  ): Observable<PagedResponse<QuestionDto>> {
    return this.http.get<PagedResponse<QuestionDto>>(
      `${BASE}/api/superadmin/questions`,
      {
        params: new HttpParams().set('page', page).set('size', size),
      },
    );
  }

  superCreateQuestion(req: QuestionCreateRequest): Observable<QuestionDto> {
    return this.http.post<QuestionDto>(`${BASE}/api/superadmin/questions`, req);
  }

  superUpdateQuestion(
    id: string,
    req: QuestionUpdateRequest,
  ): Observable<QuestionDto> {
    return this.http.put<QuestionDto>(
      `${BASE}/api/superadmin/questions/${id}`,
      req,
    );
  }

  superDeleteQuestion(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE}/api/superadmin/questions/${id}`);
  }

  /* ── Super Admin / Users ── */
  superGetUsers(page = 0, size = 50): Observable<PagedResponse<UserDto>> {
    return this.http.get<PagedResponse<UserDto>>(
      `${BASE}/api/superadmin/users`,
      {
        params: new HttpParams().set('page', page).set('size', size),
      },
    );
  }

  superDeleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE}/api/superadmin/users/${id}`);
  }

  /* ── Admin / Student Attempts ── */
  getStudentAttempts(
    page = 0,
    size = 20,
  ): Observable<PagedResponse<StudentAttemptSummaryDto>> {
    return this.http.get<PagedResponse<StudentAttemptSummaryDto>>(
      `${BASE}/api/admin/student-attempts`,
      {
        params: new HttpParams().set('page', page).set('size', size),
      },
    );
  }

  getStudentAttemptsByPaper(
    paperId: string,
    page = 0,
    size = 20,
  ): Observable<PagedResponse<StudentAttemptSummaryDto>> {
    return this.http.get<PagedResponse<StudentAttemptSummaryDto>>(
      `${BASE}/api/admin/student-attempts/by-paper/${paperId}`,
      {
        params: new HttpParams().set('page', page).set('size', size),
      },
    );
  }

  getStudentAttemptsByStudent(
    studentId: string,
    page = 0,
    size = 20,
  ): Observable<PagedResponse<StudentAttemptSummaryDto>> {
    return this.http.get<PagedResponse<StudentAttemptSummaryDto>>(
      `${BASE}/api/admin/student-attempts/by-student/${studentId}`,
      {
        params: new HttpParams().set('page', page).set('size', size),
      },
    );
  }

  getAttemptDetail(attemptId: string): Observable<AttemptDetailDto> {
    return this.http.get<AttemptDetailDto>(
      `${BASE}/api/admin/student-attempts/${attemptId}/detail`,
    );
  }
}
