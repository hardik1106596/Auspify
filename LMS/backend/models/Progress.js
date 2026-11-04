import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId }],
}, { timestamps: true });

progressSchema.index({ learner: 1, course: 1 }, { unique: true });

export default mongoose.model('Progress', progressSchema);
