import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, trim: true, maxlength: 5000 },
  submittedAt: { type: Date, default: Date.now },
}, { _id: true });

const assignmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  instructions: { type: String, required: true, trim: true, maxlength: 3000 },
  dueAt: { type: Date },
  submissions: { type: [submissionSchema], default: [] },
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema);
