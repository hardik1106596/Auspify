import { Router } from 'express';
import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const allowedCategories = {
  income: ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'],
  expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Education', 'Health', 'Entertainment', 'Other']
};

function validate(body) {
  const title = String(body.title || '').trim();
  const type = String(body.type || '');
  const category = String(body.category || '').trim();
  const amount = Number(body.amount);
  const date = String(body.date || '');
  const note = String(body.note || '').trim();
  if (!title || title.length > 100) return 'Title is required and must be 100 characters or fewer.';
  if (!['income', 'expense'].includes(type)) return 'Choose income or expense.';
  if (!allowedCategories[type].includes(category)) return 'Choose a valid category for this transaction type.';
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1000000000) return 'Amount must be a positive number.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) return 'Enter a valid date.';
  if (note.length > 300) return 'Note must be 300 characters or fewer.';
  return null;
}
function clean(body) {
  return {
    title: String(body.title).trim(),
    type: body.type,
    category: String(body.category).trim(),
    amount: Number(body.amount),
    date: String(body.date),
    note: String(body.note || '').trim()
  };
}

router.get('/', async (req, res, next) => {
  try {
    const rows = await Transaction.find({ user: req.userId }).sort({ date: -1, createdAt: -1 }).lean();
    res.json(rows.map(row => ({ ...row, _id: row._id.toString(), user: undefined })));
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const problem = validate(req.body);
    if (problem) return res.status(400).json({ message: problem });
    const transaction = await Transaction.create({ ...clean(req.body), user: req.userId });
    res.status(201).json({ ...transaction.toObject(), user: undefined });
  } catch (error) { next(error); }
});

router.put('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid transaction ID.' });
    const problem = validate(req.body);
    if (problem) return res.status(400).json({ message: problem });
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      clean(req.body),
      { new: true, runValidators: true }
    );
    if (!transaction) return res.status(404).json({ message: 'Transaction not found.' });
    res.json({ ...transaction.toObject(), user: undefined });
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid transaction ID.' });
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found.' });
    res.json({ message: 'Transaction deleted.' });
  } catch (error) { next(error); }
});

export default router;
