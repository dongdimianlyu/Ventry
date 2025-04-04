import { db } from '@/lib/firebaseConfig';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

/**
 * Checks if a user has remaining generations and increments the count if allowed
 * @param userId The Firebase user ID
 * @returns Object containing success status and message
 */
export async function checkAndUpdateGenerationLimit(userId: string): Promise<{
  allowed: boolean;
  message: string;
  remaining?: number;
}> {
  try {
    // Get the user document
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    // Handle case where user document doesn't exist
    if (!userSnap.exists()) {
      return { 
        allowed: false, 
        message: 'User not found' 
      };
    }
    
    const userData = userSnap.data();
    const currentCount = userData.generationCount || 0;
    const maxAllowed = userData.maxGenerations || 2; // Default to 2 if not set
    
    // Check if user has reached their limit
    if (currentCount >= maxAllowed) {
      return {
        allowed: false,
        message: 'Generation limit reached',
        remaining: 0
      };
    }
    
    // Increment the generation count
    await updateDoc(userRef, {
      generationCount: increment(1)
    });
    
    // Return success with remaining count
    return {
      allowed: true,
      message: 'Generation allowed',
      remaining: maxAllowed - (currentCount + 1)
    };
  } catch (error) {
    console.error('Error checking generation limit:', error);
    return {
      allowed: false,
      message: 'Error checking generation limit'
    };
  }
} 