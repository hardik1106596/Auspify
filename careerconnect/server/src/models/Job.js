
import mongoose from 'mongoose';

export const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Remote',
];

const jobSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 120,
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
      maxlength: 100,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: 100,
    },
    type: {
      type: String,
      enum: JOB_TYPES,
      default: 'Full-time',
    },
    salary: {
      type: String,
      trim: true,
      maxlength: 60,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 5000,
    },
    skills: {
      type: [String],
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);
