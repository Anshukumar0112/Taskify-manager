const express = require('express');
const Project = require('../models/Project');
const { auth, isAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const project = new Project({ 
      name, 
      description, 
      admin: req.user.id, 
      members,
      organization: req.user.organization 
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.organization ? { organization: req.user.organization } : { admin: req.user.id };
    const projects = await Project.find(query).populate('members', 'name email').populate('admin', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email')
      .populate('admin', 'name email');
    
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Check if user belongs to the organization
    if (project.organization && req.user.organization && project.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, organization: req.user.organization });
    if (!project) return res.status(404).json({ message: 'Project not found or access denied' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
