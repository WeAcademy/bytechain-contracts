/**
 * Response contracts for the `/api/v1/courses` and `/api/v1/lessons`
 * endpoints.
 *
 * Timestamps are ISO-8601 strings, not `Date` instances: these types describe
 * the JSON payloads a `fetch` consumer actually receives. The backend's DTO
 * classes hold `Date` values and Nest serialises them to strings on the way
 * out.
 */

import type { PaginatedResponse } from "./pagination.js";

/** A course as returned by `GET /courses` and `GET /courses/:id`. */
export interface CourseResponseDto {
  id: string;
  title: string;
  description: string;
  published?: boolean;
  difficulty: string | null;
  tags: string[];
  thumbnailUrl: string | null;
  enrollmentCount: number;
  /** ISO-8601 timestamp. */
  createdAt: string;
  /** ISO-8601 timestamp. */
  updatedAt: string;
  /** Present when the request is authenticated. */
  isEnrolled?: boolean;
}

/** A lesson as returned by the lessons endpoints. */
export interface LessonResponseDto {
  id: string;
  title: string;
  content: string;
  published: boolean;
  videoUrl: string | null;
  videoStartTimestamp: number | null;
  order: number;
  courseId: string;
  hasQuiz: boolean;
  quizId: string | null;
  /** ISO-8601 timestamp. */
  createdAt: string;
  /** ISO-8601 timestamp. */
  updatedAt: string;
}

/** Returned by `GET /courses/:id/enrollment-status`. */
export interface EnrollmentStatusResponseDto {
  enrolled: boolean;
  /** ISO-8601 timestamp; omitted when the user is not enrolled. */
  enrolledAt?: string;
}

/** Returned by `POST /courses/:id/enroll`. */
export interface CourseRegistrationResponseDto {
  id: string;
  userId: string;
  courseId: string;
  /** ISO-8601 timestamp. */
  enrolledAt: string;
}

/** One row of `GET /courses/enrolled`. */
export interface EnrolledCourseResponseDto {
  id: string;
  title: string;
  description: string;
  published: boolean;
  /** ISO-8601 timestamp. */
  createdAt: string;
  /** ISO-8601 timestamp. */
  updatedAt: string;
  /** Completion percentage, 0–100. */
  progressPercent: number;
  /** ISO-8601 timestamp. */
  enrolledAt: string;
}

/** Paginated response from `GET /courses`. */
export type CourseListResponseDto = PaginatedResponse<CourseResponseDto>;

/** Paginated response from `GET /lessons` and `GET /lessons/course/:courseId`. */
export type LessonListResponseDto = PaginatedResponse<LessonResponseDto>;
