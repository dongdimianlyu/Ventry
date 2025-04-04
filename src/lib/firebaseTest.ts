import { auth, db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

async function testFirebase() {
  try {
    // Test Auth
    const userCred = await signInAnonymously(auth);
    console.log('Auth working - Anonymous user ID:', userCred.user.uid);

    // Test Firestore
    const testCollection = collection(db, 'test');
    const snapshot = await getDocs(testCollection);
    console.log('Firestore working - Can query documents');

    return true;
  } catch (error) {
    console.error('Firebase test failed:', error);
    return false;
  }
}

export { testFirebase }; 