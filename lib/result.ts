export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: AppError };

export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export type AppError = {
  code: AppErrorCode;
  message: string;
  cause?: unknown;
};

export function appError(
  code: AppErrorCode,
  message: string,
  cause?: unknown,
): AppError {
  return { code, message, cause };
}
