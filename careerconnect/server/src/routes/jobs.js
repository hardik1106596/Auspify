
import { Router } from 'express';
import mongoose from 'mongoose';
import Job, { JOB_TYPES } from '../models/Job.js';
import Application from '../models/Application.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const str = (v) => (typeof v === 'string' ? v.trim() : '');

const FIELDS = [
  'title',
  'company',
  'location',
  'type',
  'salary',
  'description',
  'skills',
  'active',
];

function pickFields(body) {
  const data = {};

  for (const key of FIELDS) {
    if (body[key] === undefined) continue;

    if (key === 'skills') {
      const list = Array.isArray(body.skills)
        ? body.skills
        : String(body.skills).split(',');

      data.skills = list
        .map((s) => String(s).trim())
        .filter(Boolean)
        .slice(0, 15);
    } else if (key === 'active') {
      data.active = Boolean(body.active);
    } else {
      data[key] = str(body[key]);
    }
  }

  if (data.type !== undefined && !JOB_TYPES.includes(data.type)) {
    data.type = 'Full-time';
  }

  return data;
}

router.get('/', async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = 10;

  const filter = { active: true };

  const q = str(req.query.q).slice(0, 60);
  const location = str(req.query.location).slice(0, 60);

  if (q) {
    const r = new RegExp(esc(q), 'i');

    filter.$or = [
      { title: r },
      { company: r },
      { skills: r },
    ];
  }

  if (location) {
    filter.location = new RegExp(esc(location), 'i');
  }

  if (JOB_TYPES.includes(req.query.type)) {
    filter.type = req.query.type;
  }

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),

    Job.countDocuments(filter),
  ]);

  res.json({
    jobs,
    total,
    page,
    pages: Math.max(Math.ceil(total / limit), 1),
  });
});

router.get('/mine', protect, requireRole('employer'), async (req, res) => {
  const jobs = await Job.find({
    employer: req.user.id,
  }).sort({ createdAt: -1 });

  res.json({ jobs });
});

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({
      message: 'Job not found',
    });
  }

  const job = await Job.findOne({
    _id: req.params.id,
    active: true,
  });

  if (!job) {
    return res.status(404).json({
      message: 'Job not found',
    });
  }

  res.json({ job });
});

router.post('/', protect, requireRole('employer'), async (req, res) => {
  const data = pickFields(req.body);

  if (!data.company) {
    data.company = req.user.company;
  }

  const job = await Job.create({
    ...data,
    employer: req.user.id,
  });

  res.status(201).json({ job });
});

async function ownedJob(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).json({
      message: 'Job not found',
    });

    return null;
  }

  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404).json({
      message: 'Job not found',
    });

    return null;
  }

  if (job.employer.toString() !== req.user.id) {
    res.status(403).json({
      message: 'You can only change your own jobs',
    });

    return null;
  }

  return job;
}

router.patch('/:id', protect, requireRole('employer'), async (req, res) => {
  const job = await ownedJob(req, res);

  if (!job) return;

  job.set(pickFields(req.body));
  await job.save();

  res.json({ job });
});

router.delete('/:id', protect, requireRole('employer'), async (req, res) => {
  const job = await ownedJob(req, res);

  if (!job) return;

  await Application.deleteMany({ job: job._id });
  await job.deleteOne();

  res.json({ message: 'Job deleted' });
});

export default router;
