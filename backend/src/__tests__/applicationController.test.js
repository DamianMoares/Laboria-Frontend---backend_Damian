const mockDb = {
  job: { findUnique: vi.fn() },
  application: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  courseApplication: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  course: {},
  user: {},
};

const mockEmailService = { sendApplicationReceived: vi.fn() };

let originalCache;
let originalEmailCache;

const mockReq = (overrides = {}) => ({
  body: {},
  params: {},
  user: { id: 'candidate-1', role: 'CANDIDATE' },
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

describe('Application Controller', () => {
  beforeAll(() => {
    const dbPath = require.resolve('../config/database');
    originalCache = require.cache[dbPath];
    require.cache[dbPath] = {
      id: dbPath, filename: dbPath, loaded: true, exports: mockDb,
    };
    const emailPath = require.resolve('../services/emailService');
    originalEmailCache = require.cache[emailPath];
    require.cache[emailPath] = {
      id: emailPath, filename: emailPath, loaded: true, exports: mockEmailService,
    };
  });

  afterAll(() => {
    const dbPath = require.resolve('../config/database');
    require.cache[dbPath] = originalCache || undefined;
    const emailPath = require.resolve('../services/emailService');
    require.cache[emailPath] = originalEmailCache || undefined;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('create application returns 404 for non-existent job', async () => {
    mockDb.job.findUnique.mockResolvedValue(null);

    const applicationController = require('../controllers/applicationController');
    const req = mockReq({ body: { jobId: 'nonexistent' } });
    const res = mockRes();

    await applicationController.create(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
  });

  it('create application returns 409 for duplicate application', async () => {
    mockDb.job.findUnique.mockResolvedValue({ id: 'job-1', title: 'Dev', author: null });
    mockDb.application.findUnique.mockResolvedValue({ id: 'existing', userId: 'candidate-1', jobId: 'job-1' });

    const applicationController = require('../controllers/applicationController');
    const req = mockReq({ body: { jobId: 'job-1' } });
    const res = mockRes();

    await applicationController.create(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(409);
  });

  it('create application succeeds for candidate', async () => {
    mockDb.job.findUnique.mockResolvedValue({ id: 'job-1', title: 'Dev', author: null });
    mockDb.application.findUnique.mockResolvedValue(null);
    mockDb.application.create.mockResolvedValue({
      id: 'app-1', userId: 'candidate-1', jobId: 'job-1', message: 'Me interesa',
      user: { id: 'candidate-1', name: 'Ana', email: 'ana@test.com' },
      job: { id: 'job-1', title: 'Dev', company: 'TechCorp' },
    });

    const applicationController = require('../controllers/applicationController');
    const req = mockReq({ body: { jobId: 'job-1', message: 'Me interesa' } });
    const res = mockRes();

    await applicationController.create(req, res, mockNext);

    expect(mockDb.application.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('myApplications returns user applications', async () => {
    mockDb.application.findMany.mockResolvedValue([
      { id: 'app-1', jobId: 'job-1', status: 'PENDING', job: { title: 'Dev' } },
    ]);

    const applicationController = require('../controllers/applicationController');
    const req = mockReq();
    const res = mockRes();

    await applicationController.myApplications(req, res, mockNext);

    expect(mockDb.application.findMany).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  it('updateStatus rejects invalid status', async () => {
    const applicationController = require('../controllers/applicationController');
    const req = mockReq({ params: { id: 'app-1' }, body: { status: 'INVALID' } });
    const res = mockRes();

    await applicationController.updateStatus(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(400);
  });

  it('cancel returns 404 for non-existent application', async () => {
    mockDb.application.findUnique.mockResolvedValue(null);

    const applicationController = require('../controllers/applicationController');
    const req = mockReq({ params: { id: 'nonexistent' } });
    const res = mockRes();

    await applicationController.cancel(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
  });
});
