vi.mock('../config/database', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

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

describe('User Controller - login validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects login without email', async () => {
    const { login } = require('../controllers/userController');
    const req = mockReq({ body: { password: '123456' } });
    const res = mockRes();

    await login(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error).toBeDefined();
  });

  it('rejects login without password', async () => {
    const { login } = require('../controllers/userController');
    const req = mockReq({ body: { email: 'test@test.com' } });
    const res = mockRes();

    await login(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error).toBeDefined();
  });

  it('rejects register without required fields', async () => {
    const { register } = require('../controllers/userController');
    const req = mockReq({ body: {} });
    const res = mockRes();

    await register(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error).toBeDefined();
  });
});
