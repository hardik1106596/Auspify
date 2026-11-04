import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  prompt: { type: String, required: true, trim: true, maxlength: 500 },
  options: { type: [{ type: String, trim: true }], validate: (items) => items.length >= 2 },
  correctAnswer: { type: Number, required: true, min: 0 },
}, { _id: true });

const quizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  questions: { type: [questionSchema], default: [] },
}, { timestamps: true });

export default mongoose.model('Quiz', quizSchema);
