import UserModel from '../models/user.js';
import { db } from '../config/firebase.js';

export const getAllUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 25;
    console.log('Fetching users with limit:', limit);

    const usersSnapshot = await db.collection('users')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()  // Convert timestamp to date
    }));

    console.log('Sending users:', users.length);
    res.status(200).json(users);

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json([]);
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, referralCode } = req.body;
    
    if (!name || !email) {
      res.status(400).json({
        error: 'Missing required fields',
        details: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null
        }
      });
      return;
    }

    const existingUser = await UserModel.getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({
        error: 'User already exists',
        details: 'This email is already registered'
      });
      return;
    }

    if (referralCode) {
      const referrer = await UserModel.getUserByReferralCode(referralCode);
      if (referrer) {
        await UserModel.updateReferralCount(referrer.id, (referrer.referrals || 0) + 1);
      }
    }
    
    const newUser = await UserModel.createUser({ name, email, referralCode });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      error: 'Failed to create user',
      details: error.message
    });
  }
};
