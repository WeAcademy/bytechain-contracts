/**
 * Response contracts for the `/api/v1/auth` endpoints.
 *
 * These mirror the objects returned by `AuthService` in the backend. Token
 * values are opaque strings; they are never decoded by consumers.
 */

/** Role assigned to a user account. */
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

/** The subset of the user record returned with auth tokens. */
export interface AuthUserDto {
  id: string;
  email: string;
  role: UserRole;
}

/** Returned by `POST /auth/register` and `POST /auth/login`. */
export interface AuthResponseDto {
  user: AuthUserDto;
  accessToken: string;
  refreshToken: string;
}

/** Returned by `POST /auth/refresh`. */
export interface RefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
}

/** Returned by `POST /auth/logout`, forgot-password and reset-password. */
export interface MessageResponseDto {
  message: string;
}
