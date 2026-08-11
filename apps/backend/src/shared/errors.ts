export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  public constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  public constructor(resourceName: string) {
    super(`${resourceName} was not found.`, 404);
  }
}
