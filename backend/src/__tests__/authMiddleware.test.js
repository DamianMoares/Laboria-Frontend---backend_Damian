const mockDb = {
  user: {
    findUnique: vi.fn(),
  },
  job: {},
  course: {},
  application: {},
};

const mockVerifyToken = vi.fn();

const mockReq = (overrides = {}) => ({
  headers: {},
  ...overrides,
});

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const mockNext = vi.fn();

describe('Auth Middleware', () => {
  let originalDbCache;
  let originalJwtCache;

  beforeAll(() => {
    const dbPath = require.resolve('../config/database');
    originalDbCache = require.cache[dbPath];
    require.cache[dbPath] = {
      id: dbPath,
      filename: dbPath,
      loaded: true,
      exports: mockDb,
    };

    const jwtPath = require.resolve('../utils/jwt');
    originalJwtCache = require.cache[jwtPath];
    require.cache[jwtPath] = {
      id: jwtPath,
      filename: jwtPath,
      loaded: true,
      exports: { verifyToken: mockVerifyToken },
    };
  });

  afterAll(() => {
    const dbPath = require.resolve('../config/database');
    if (originalDbCache) {
      require.cache[dbPath] = originalDbCache;
    } else {
      delete require.cache[dbPath];
    }
    const jwtPath = require.resolve('../utils/jwt');
    if (originalJwtCache) {
      require.cache[jwtPath] = originalJwtCache;
    } else {
      delete require.cache[jwtPath];
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects request without authorization header', async () => {
    const authMiddleware = require('../middleware/authMiddleware');
    const req = mockReq();
    const res = mockRes();

    await authMiddleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(401);
    expect(error.message).toContain('Token no proporcionado');
  });

  it('rejects request with invalid token', async () => {
    mockVerifyToken.mockReturnValue(null);

    const authMiddleware = require('../middleware/authMiddleware');
    const req = mockReq({ headers: { authorization: 'Bearer invalid-token' } });
    const res = mockRes();

    await authMiddleware(req, res, mockNext);

    expect(mockVerifyToken).toHaveBeenCalledWith('invalid-token');
    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(401);
    expect(error.message).toContain('Token inválido');
  });

  it('rejects request when user not found in database', async () => {
    mockVerifyToken.mockReturnValue({ userId: 'nonexistent' });
    mockDb.user.findUnique.mockResolvedValue(null);

    const authMiddleware = require('../middleware/authMiddleware');
    const req = mockReq({ headers: { authorization: 'Bearer valid-token' } });
    const res = mockRes();

    await authMiddleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
    expect(error.message).toContain('Usuario no encontrado');
  });

  it('passes user to next() with valid token', async () => {
    mockVerifyToken.mockReturnValue({ userId: 'user-1' });
    mockDb.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@test.com',
      name: 'Test',
      role: 'CANDIDATE',
    });

    const authMiddleware = require('../middleware/authMiddleware');
    const req = mockReq({ headers: { authorization: 'Bearer valid-token' } });
    const res = mockRes();

    await authMiddleware(req, res, mockNext);

    expect(req.user).toBeDefined();
    expect(req.user.id).toBe('user-1');
    expect(mockNext).toHaveBeenCalledWith();
  });
});
