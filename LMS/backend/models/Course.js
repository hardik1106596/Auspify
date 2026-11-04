import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, trim: true, maxlength: 1000, default: '' },
  videoUrl: { type: String, trim: true, default: '' },
}, { timestamps: true });

const courseSchema = new mongoose.Schema({
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 3000 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  lessons: { type: [lessonSchema], default: [] },
  learningOutcomes: { type: [String], default: [] },
  published: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
