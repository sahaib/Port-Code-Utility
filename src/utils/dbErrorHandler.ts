import { Prisma } from '@prisma/client';

export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export const handleDatabaseError = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new DatabaseError('Duplicate entry found', 'DUPLICATE_ENTRY', error);
      case 'P2025':
        throw new DatabaseError('Record not found', 'NOT_FOUND', error);
      case 'P2001':
        throw new DatabaseError('Record search failed', 'SEARCH_FAILED', error);
      default:
        throw new DatabaseError(
          `Database error: ${error.message}`,
          'UNKNOWN_ERROR',
          error
        );
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new DatabaseError(
      'Invalid data provided to database',
      'VALIDATION_ERROR',
      error
    );
  }

  throw new DatabaseError(
    'An unexpected database error occurred',
    'UNEXPECTED_ERROR',
    error
  );
}; 