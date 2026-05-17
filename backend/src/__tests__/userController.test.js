const mockDb = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  job: {},
  course: {},
  application: {},
};

const mockReq = (overrides = {}) => ({
  body: {},
  params: {},
  user: { id: 'user-1', role: 'CANDIDATE' },
  ...overrides,
});

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const mockNext = vi.fn();

describe('User Controller', () => {
  let originalCache;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
    const dbPath = require.resolve('../config/database');
    originalCache = require.cache[dbPath];
    require.cache[dbPath] = {
      id: dbPath,
      filename: dbPath,
      loaded: true,
      exports: mockDb,
    };
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
    const dbPath = require.resolve('../config/database');
    if (originalCache) {
      require.cache[dbPath] = originalCache;
    } else {
      delete require.cache[dbPath];
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects login with invalid credentials (user not found)', async () => {
    mockDb.user.findUnique.mockResolvedValue(null);

    const { login } = require('../controllers/userController');
    const req = mockReq({ body: { email: 'notfound@test.com', password: '123456' } });
    const res = mockRes();

    await login(req, res, mockNext);

    expect(mockDb.user.findUnique).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(401);
  });

  it('rejects login with wrong password', async () => {
    const bcrypt = require('bcryptjs');
    mockDb.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'test@test.com',
      password: bcrypt.hashSync('correct', 10),
    });

    const { login } = require('../controllers/userController');
    const req = mockReq({ body: { email: 'test@test.com', password: 'wrong' } });
    const res = mockRes();

    await login(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(401);
  });

  it('rejects register with duplicate email', async () => {
    mockDb.user.findUnique.mockResolvedValue({ id: 'existing', email: 'dup@test.com' });

    const { register } = require('../controllers/userController');
    const req = mockReq({ body: { email: 'dup@test.com', password: '123456', name: 'Test' } });
    const res = mockRes();

    await register(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(409);
  });

  it('creates user successfully with valid data', async () => {
    mockDb.user.findUnique.mockResolvedValue(null);
    mockDb.user.create.mockResolvedValue({
      id: 'new-user',
      email: 'new@test.com',
      name: 'New User',
      role: 'CANDIDATE',
    });

    const { register } = require('../controllers/userController');
    const req = mockReq({ body: { email: 'new@test.com', password: '123456', name: 'New User' } });
    const res = mockRes();

    await register(req, res, mockNext);

    expect(mockDb.user.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('returns 404 when updating non-existent user', async () => {
    mockDb.user.findUnique.mockResolvedValue(null);

    const { updateProfile } = require('../controllers/userController');
    const req = mockReq({ params: { id: 'nonexistent' }, body: { name: 'New' } });
    const res = mockRes();

    await updateProfile(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
  });

  it('returns 404 when deleting non-existent user', async () => {
    mockDb.user.findUnique.mockResolvedValue(null);

    const { deleteAccount } = require('../controllers/userController');
    const req = mockReq({ params: { id: 'nonexistent' } });
    const res = mockRes();

    await deleteAccount(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
  });
});
