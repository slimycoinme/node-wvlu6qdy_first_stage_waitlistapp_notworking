import { db } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

class UserModel {
  static async createUser({ name, email, referralCode }) {
    try {
      const userRef = await db.collection('users').add({
        name,
        email,
        referralCode,
        referrals: 0,
        createdAt: FieldValue.serverTimestamp()
      });
      
      const userDoc = await userRef.get();
      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getUserByEmail(email) {
    try {
      const snapshot = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();
      
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  static async getUserByReferralCode(referralCode) {
    try {
      const snapshot = await db.collection('users')
        .where('referralCode', '==', referralCode)
        .limit(1)
        .get();
      
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error getting user by referral code:', error);
      throw error;
    }
  }

  static async updateReferralCount(userId, count) {
    try {
      await db.collection('users').doc(userId).update({
        referrals: count,
        updatedAt: FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating referral count:', error);
      throw error;
    }
  }
}

export default UserModel;
