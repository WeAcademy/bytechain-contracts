import { describe, expect, it } from "vitest";
import type {
  AuthResponseDto,
  CourseListResponseDto,
  CourseRegistrationResponseDto,
  EnrolledCourseResponseDto,
  EnrollmentStatusResponseDto,
  LessonResponseDto,
  MessageResponseDto,
  RefreshTokenResponseDto,
} from "./index.js";
import { UserRole } from "./index.js";

const ISO_DATE = "2026-04-22T00:00:00.000Z";

describe("auth response contracts", () => {
  it("models a login/register payload", () => {
    const payload: AuthResponseDto = {
      user: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "learner@example.com",
        role: UserRole.USER,
      },
      accessToken: "access-token",
      refreshToken: "refresh-token",
    };

    expect(payload.user.role).toBe("user");
    expect(payload.accessToken).toBe("access-token");
  });

  it("models refresh and message payloads", () => {
    const refreshed: RefreshTokenResponseDto = {
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    };
    const message: MessageResponseDto = {
      message: "Logged out successfully",
    };

    expect(refreshed.refreshToken).toBe("new-refresh-token");
    expect(message.message).toBe("Logged out successfully");
  });
});

describe("course response contracts", () => {
  it("models a paginated course list", () => {
    const payload: CourseListResponseDto = {
      data: [
        {
          id: "course-1",
          title: "Intro to Blockchain",
          description: "A concise description of the course.",
          published: true,
          difficulty: "Beginner",
          tags: ["blockchain", "tech"],
          thumbnailUrl: null,
          enrollmentCount: 120,
          createdAt: ISO_DATE,
          updatedAt: ISO_DATE,
          isEnrolled: false,
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    expect(payload.data[0]?.createdAt).toBe(ISO_DATE);
    expect(payload.data[0]?.tags).toContain("blockchain");
  });

  it("models a lesson payload", () => {
    const lesson: LessonResponseDto = {
      id: "lesson-1",
      title: "What is a blockchain?",
      content: "Lesson body",
      published: true,
      videoUrl: null,
      videoStartTimestamp: null,
      order: 1,
      courseId: "course-1",
      hasQuiz: true,
      quizId: "quiz-1",
      createdAt: ISO_DATE,
      updatedAt: ISO_DATE,
    };

    expect(lesson.quizId).toBe("quiz-1");
    expect(lesson.order).toBe(1);
  });

  it("models enrolment payloads", () => {
    const status: EnrollmentStatusResponseDto = {
      enrolled: true,
      enrolledAt: ISO_DATE,
    };
    const registration: CourseRegistrationResponseDto = {
      id: "registration-1",
      userId: "user-1",
      courseId: "course-1",
      enrolledAt: ISO_DATE,
    };
    const enrolledCourse: EnrolledCourseResponseDto = {
      id: "course-1",
      title: "Intro to Blockchain",
      description: "A concise description of the course.",
      published: true,
      createdAt: ISO_DATE,
      updatedAt: ISO_DATE,
      progressPercent: 42,
      enrolledAt: ISO_DATE,
    };

    expect(status.enrolled).toBe(true);
    expect(registration.courseId).toBe("course-1");
    expect(enrolledCourse.progressPercent).toBe(42);
  });
});
