import express from 'express';
import { getAllUsers, createUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    console.log('GET /users request received');
    await getAllUsers(req, res);
    console.log('GET /users request completed');
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({
      data: {
        items: [],
        pagination: {
          total: 0,
          hasMore: false
        }
      },
      success: false,
      error: 'Internal server error'
    });
  }
});

router.post('/users', async (req, res) => {
  try {
    await createUser(req, res);
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({
      data: {
        items: [],
        pagination: {
          total: 0,
          hasMore: false
        }
      },
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
