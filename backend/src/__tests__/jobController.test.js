const mockDb = {
  job: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    count: vi.fn(),
  },
  course: {},
  user: {},
  application: {},
};

const mockReq = (overrides = {}) => ({
  body: {},
  params: {},
  user: { id: 'user-1', role: 'CANDIDATE' },
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

describe('Job Controller', () => {
  let originalCache;

  beforeAll(() => {
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

  it('lists all jobs', async () => {
    const jobs = [
      { id: '1', title: 'Dev', company: 'Co', author: { id: 'u1', name: 'A' } },
    ];
    mockDb.job.findMany.mockResolvedValue(jobs);
    mockDb.job.count.mockResolvedValue(jobs.length);

    const jobController = require('../controllers/jobController');
    const req = mockReq();
    const res = mockRes();

    await jobController.list(req, res, mockNext);

    expect(mockDb.job.findMany).toHaveBeenCalledOnce();
    expect(mockDb.job.count).toHaveBeenCalledOnce();
    expect(res.json).toHaveBeenCalled();
  });

  it('rejects job creation by candidate role', async () => {
    const jobController = require('../controllers/jobController');
    const req = mockReq({
      body: { title: 'Dev', company: 'Co', description: 'Desc' },
      user: { id: 'user-1', role: 'CANDIDATE' },
    });
    const res = mockRes();

    await jobController.create(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(403);
  });

  it('creates job successfully as company', async () => {
    mockDb.job.create.mockResolvedValue({
      id: 'new-job',
      title: 'Dev',
      company: 'Co',
      description: 'Desc',
      author: { id: 'u1', name: 'A' },
    });

    const jobController = require('../controllers/jobController');
    const req = mockReq({
      body: { title: 'Dev', company: 'Co', description: 'Desc' },
      user: { id: 'user-1', role: 'COMPANY_EMPLOYEES' },
    });
    const res = mockRes();

    await jobController.create(req, res, mockNext);

    expect(mockDb.job.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('returns 404 for non-existent job detail', async () => {
    mockDb.job.findUnique.mockResolvedValue(null);

    const jobController = require('../controllers/jobController');
    const req = mockReq({ params: { id: 'nonexistent' } });
    const res = mockRes();

    await jobController.detail(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
  });
});
