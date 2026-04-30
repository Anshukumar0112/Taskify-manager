const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, dueDate, project, assignee } = req.body;
    const proj = await Project.findById(project);
    if (!proj) return res.status(404).json({ message: 'Project not found' });

    // Ensure project belongs to organization
    if (proj.organization && req.user.organization && proj.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const task = new Task({ 
      title, 
      description, 
      status, 
      dueDate, 
      project, 
      assignee,
      organization: req.user.organization 
    });
    await task.save();
    
    // Return populated task
    const populatedTask = await Task.findById(task._id).populate('project', 'name').populate('assignee', 'name email');
    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const query = { project: req.params.projectId };
    if (req.user.organization) query.organization = req.user.organization;
    
    const tasks = await Task.find(query).populate('project', 'name').populate('assignee', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const query = { assignee: req.user.id };
    if (req.user.organization) query.organization = req.user.organization;

    const tasks = await Task.find(query).populate('project', 'name').populate('assignee', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const query = req.user.organization ? { organization: req.user.organization } : {};
    const tasks = await Task.find(query).populate('project', 'name').populate('assignee', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.organization) query.organization = req.user.organization;

    const task = await Task.findOneAndUpdate(query, req.body, { new: true }).populate('project', 'name').populate('assignee', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found or access denied' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.organization) query.organization = req.user.organization;

    const task = await Task.findOneAndDelete(query);
    if (!task) return res.status(404).json({ message: 'Task not found or access denied' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
