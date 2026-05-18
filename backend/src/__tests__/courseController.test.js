const mockDb = {
  course: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  job: {},
  user: {},
  application: {},
};

let originalCache;

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

describe('Course Controller', () => {
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

  it('lists all courses', async () => {
    const courses = [
      { id: '1', title: 'React', provider: 'U', author: { id: 'u1', name: 'A' } },
    ];
    mockDb.course.findMany.mockResolvedValue(courses);
    mockDb.course.count.mockResolvedValue(courses.length);

    const courseController = require('../controllers/courseController');
    const req = mockReq();
    const res = mockRes();

    await courseController.list(req, res, mockNext);

    expect(mockDb.course.findMany).toHaveBeenCalledOnce();
    expect(mockDb.course.count).toHaveBeenCalledOnce();
    expect(res.json).toHaveBeenCalled();
  });

  it('rejects course creation by candidate role', async () => {
    const courseController = require('../controllers/courseController');
    const req = mockReq({
      body: { title: 'React', provider: 'U', description: 'Desc' },
      user: { id: 'candidate-1', role: 'CANDIDATE' },
    });
    const res = mockRes();

    await courseController.create(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(403);
  });

  it('creates course successfully as company', async () => {
    mockDb.course.create.mockResolvedValue({
      id: 'new-course',
      title: 'React',
      provider: 'U',
      description: 'Desc',
      author: { id: 'u1', name: 'A' },
    });

    const courseController = require('../controllers/courseController');
    const req = mockReq({
      body: { title: 'React', provider: 'U', description: 'Desc' },
      user: { id: 'user-1', role: 'COMPANY_STUDENTS' },
    });
    const res = mockRes();

    await courseController.create(req, res, mockNext);

    expect(mockDb.course.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('returns 404 for non-existent course detail', async () => {
    mockDb.course.findUnique.mockResolvedValue(null);

    const courseController = require('../controllers/courseController');
    const req = mockReq({ params: { id: 'nonexistent' } });
    const res = mockRes();

    await courseController.detail(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
  });
});
