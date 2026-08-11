export const successResponse = <T>(data: T, meta?: Record<string, unknown>) => ({
  success: true,
  data,
  ...(meta ? { meta } : {}),
  timestamp: new Date().toISOString(),
});

export const errorResponse = (
  code: string,
  message: string,
  details: unknown[] = []
) => ({
  success: false,
  error: {
    code,
    message,
    details,
  },
  timestamp: new Date().toISOString(),
});

