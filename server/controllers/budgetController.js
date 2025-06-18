const Budget = require('../models/Budget');

exports.createBudget = async (req, res) => {
  try {
    const budget = await Budget.create(req.body);
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().populate('eventId').populate('submittedBy');
    res.status(200).json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id).populate('eventId').populate('submittedBy');
    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    res.status(200).json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateBudget = async (req, res) => {
  try {
    const updated = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Budget not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deleteBudget = async (req, res) => {
  try {
    const deleted = await Budget.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Budget not found' });
    res.status(200).json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
