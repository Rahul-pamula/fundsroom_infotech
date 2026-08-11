process.env.NODE_ENV = 'test';
process.env.CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret-123456';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '12h';
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? process.env.TEST_DATABASE_URL ?? 'postgres://postgres:postgres@127.0.0.1:5432/minierp_test';

