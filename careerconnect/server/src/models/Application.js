
import mongoose from 'mongoose';

export const STATUSES = [
  'pending',
  'reviewed',
  'shortlisted',
  'rejected',
];

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    seeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coverLetter: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: '',
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'pending',
    },
  },
  { timestamps: true }
);

applicationSchema.index(
  { job: 1, seeker: 1 },
  { unique: true }
);

export default mongoose.model('Application', applicationSchema);
