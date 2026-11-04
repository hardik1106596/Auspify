
import { Router } from 'express';
import mongoose from 'mongoose';
import Application, { STATUSES } from '../models/Application.js';
import Job from '../models/Job.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/mine', requireRole('seeker'), async (req, res) => {
  const applications = await Application.find({
    seeker: req.user.id,
  })
    .populate('job', 'title company location type active')
    .sort({ createdAt: -1 });

  res.json({ applications });
});

router.get('/received', requireRole('employer'), async (req, res) => {
  const ids = await Job.find({
    employer: req.user.id,
  }).distinct('_id');

  const applications = await Application.find({
    job: { $in: ids },
  })
    .populate('seeker', 'name email')
    .populate('job', 'title company')
    .sort({ createdAt: -1 });

  res.json({ applications });
});

router.patch('/:id/status', requireRole('employer'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({
      message: 'Application not found',
    });
  }

  if (!STATUSES.includes(req.body.status)) {
    return res.status(400).json({
      message: 'Invalid status',
    });
  }

  const app = await Application.findById(req.params.id)
    .populate('job', 'employer');

  if (!app || !app.job) {
    return res.status(404).json({
      message: 'Application not found',
    });
  }

  if (app.job.employer.toString() !== req.user.id) {
    return res.status(403).json({
      message: 'You can only update applications to your own jobs',
    });
  }

  app.status = req.body.status;
  await app.save();

  res.json({
    application: {
      id: app.id,
      status: app.status,
    },
  });
});

router.post('/:jobId', requireRole('seeker'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.jobId)) {
    return res.status(404).json({
      message: 'Job not found',
    });
  }

  const job = await Job.findOne({
    _id: req.params.jobId,
    active: true,
  });

  if (!job) {
    return res.status(404).json({
      message: 'Job not found or no longer open',
    });
  }

  const coverLetter =
    typeof req.body.coverLetter === 'string'
      ? req.body.coverLetter.trim()
      : '';

  try {
    const application = await Application.create({
      job: job._id,
      seeker: req.user.id,
      coverLetter,
    });

    res.status(201).json({ application });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({
        message: 'You have already applied to this job',
      });
    }

    throw e;
  }
});

export default router;
