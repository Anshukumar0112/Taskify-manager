const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');
const { auth, isAdmin } = require('../middleware/auth');

// Public endpoint to get all organizations for registration dropdown
router.get('/organizations/public', async (req, res) => {
  try {
    const orgs = await Organization.find({}, 'name');
    res.json(orgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create organization for existing admins
router.post('/organizations/create', auth, isAdmin, async (req, res) => {
  console.log(`User ${req.user.id} attempting to create organization: ${req.body.name}`);
  try {
    const { name } = req.body;
    let org = await Organization.findOne({ name });
    if (org) {
      console.log(`Org name taken: ${name}`);
      return res.status(400).json({ message: 'Organization name already taken' });
    }

    org = new Organization({ name, admin: req.user.id });
    await org.save();
    console.log(`Org created: ${org._id}`);

    await User.findByIdAndUpdate(req.user.id, { organization: org._id });
    res.json(org);
  } catch (err) {
    console.error(`Org creation error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, orgName, orgId } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let finalRole = role || 'Member';
    let status = 'Active';
    let organizationId = orgId || null;

    // If Admin is creating a new organization
    if (finalRole === 'Admin' && orgName && !organizationId) {
      let org = await Organization.findOne({ name: orgName });
      if (org) {
        return res.status(400).json({ message: 'Organization already exists. Please join as a member or use a different name.' });
      }
      org = new Organization({ name: orgName });
      await org.save();
      organizationId = org._id;
    }

    // Validation for members
    if (finalRole === 'Member' && !organizationId) {
      return res.status(400).json({ message: 'Please select an organization to join.' });
    }

    if (finalRole === 'Admin') {
      const adminExists = await User.findOne({ role: 'Admin', status: 'Active', organization: organizationId });
      if (adminExists) {
        status = 'Pending';
      }
    }

    user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: finalRole, 
      status, 
      organization: organizationId 
    });
    
    await user.save();

    if (organizationId) {
      const org = await Organization.findById(organizationId);
      if (!org.admin && finalRole === 'Admin') {
        org.admin = user._id;
        await org.save();
      }
    }

    if (status === 'Pending') {
      return res.status(202).json({ message: 'Account created successfully. Your admin access is currently pending approval.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, organization: user.organization }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ 
      token, 
      user: { id: user._id, name, email, role: user.role, organization: user.organization } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.status === 'Pending') return res.status(403).json({ message: 'Your account is currently pending approval from the administrator.' });
    if (user.status === 'Rejected') return res.status(403).json({ message: 'Your account request was rejected.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role, organization: user.organization }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role, organization: user.organization } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('organization');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users', auth, async (req, res) => {
  try {
    const query = req.user.organization ? { organization: req.user.organization } : {};
    const users = await User.find(query, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users/public', async (req, res) => {
  try {
    const users = await User.find({ status: 'Active' }).select('name role').limit(5);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
