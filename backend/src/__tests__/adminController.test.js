const mockDb = {
  user: {
    count: vi.fn(),
    groupBy: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    delete: vi.fn(),
  },
  job: {
    count: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), delete: vi.fn(), groupBy: vi.fn(),
  },
  course: {
    count: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), delete: vi.fn(), groupBy: vi.fn(),
  },
  application: {
    count: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), groupBy: vi.fn(),
  },
  auditLog: { findMany: vi.fn(), count: vi.fn() },
};

const mockAuditService = { logAction: vi.fn() };

let originalCache;
let originalAuditCache;

const mockReq = (overrides = {}) => ({
  body: {},
  params: {},
  user: { id: 'admin-1', role: 'ADMIN' },
  query: {},
  ...overrides,
});

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const mockNext = vi.fn();

describe('Admin Controller', () => {
  beforeAll(() => {
    const dbPath = require.resolve('../config/database');
    originalCache = require.cache[dbPath];
    require.cache[dbPath] = {
      id: dbPath, filename: dbPath, loaded: true, exports: mockDb,
    };
    const auditPath = require.resolve('../services/auditService');
    originalAuditCache = require.cache[auditPath];
    require.cache[auditPath] = {
      id: auditPath, filename: auditPath, loaded: true, exports: mockAuditService,
    };
  });

  afterAll(() => {
    const dbPath = require.resolve('../config/database');
    require.cache[dbPath] = originalCache || undefined;
    const auditPath = require.resolve('../services/auditService');
    require.cache[auditPath] = originalAuditCache || undefined;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getDashboardStats returns aggregated stats', async () => {
    mockDb.user.groupBy
      .mockResolvedValueOnce([{ role: 'CANDIDATE', _count: { id: 10 } }]);
    mockDb.user.count.mockResolvedValue(20);
    mockDb.job.count.mockResolvedValue(15);
    mockDb.course.count.mockResolvedValue(8);
    mockDb.application.count.mockResolvedValue(5);
    mockDb.application.groupBy
      .mockResolvedValueOnce([{ status: 'PENDING', _count: { id: 3 } }]);
    mockDb.job.groupBy
      .mockResolvedValueOnce([{ category: 'TECH', _count: { id: 7 } }]);
    mockDb.course.groupBy
      .mockResolvedValueOnce([{ level: 'BEGINNER', _count: { id: 4 } }]);
    // user.count is called twice (total + recent), so use mockResolvedValueOnce for recent

    const { getDashboardStats } = require('../controllers/adminController');
    const req = mockReq();
    const res = mockRes();

    await getDashboardStats(req, res, mockNext);

    expect(res.json).toHaveBeenCalled();
    const data = res.json.mock.calls[0][0];
    expect(data.stats).toBeDefined();
    expect(data.success).toBe(true);
  });

  it('getAllUsers returns paginated users', async () => {
    mockDb.user.findMany.mockResolvedValue([{ id: 'u1', name: 'Test' }]);
    mockDb.user.count.mockResolvedValue(1);

    const { getAllUsers } = require('../controllers/adminController');
    const req = mockReq();
    const res = mockRes();

    await getAllUsers(req, res, mockNext);

    expect(mockDb.user.findMany).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  it('deleteUserAsAdmin returns 404 for non-existent user', async () => {
    mockDb.user.findUnique.mockResolvedValue(null);

    const { deleteUserAsAdmin } = require('../controllers/adminController');
    const req = mockReq({ params: { id: 'nonexistent' } });
    const res = mockRes();

    await deleteUserAsAdmin(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
  });

  it('runTests returns 403 in production', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const { runTests } = require('../controllers/adminController');
    const req = mockReq();
    const res = mockRes();

    await runTests(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);

    process.env.NODE_ENV = originalNodeEnv;
  });

  it('getAuditLogs returns audit log entries', async () => {
    mockDb.auditLog.findMany.mockResolvedValue([
      { id: 'log-1', action: 'USER_DELETED', adminId: 'admin-1', createdAt: new Date() },
    ]);
    mockDb.auditLog.count.mockResolvedValue(1);

    const { getAuditLogs } = require('../controllers/adminController');
    const req = mockReq();
    const res = mockRes();

    await getAuditLogs(req, res, mockNext);

    expect(mockDb.auditLog.findMany).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });
});
