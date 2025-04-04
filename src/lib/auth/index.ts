import { auth, db } from '../firebaseConfig';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  getIdToken, 
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import Cookies from 'js-cookie';

// Helper function to set auth cookies
const setAuthCookies = async (user: any, rememberMe: boolean = false) => {
  try {
    // Get the Firebase ID token
    const token = await getIdToken(user);
    
    // Set the token as a cookie - secure in production
    // If rememberMe is true, set a longer expiration (14 days), otherwise session cookie
    const expiresInDays = rememberMe ? 14 : undefined;
    
    Cookies.set('firebase-auth-token', token, { 
      expires: expiresInDays, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Strict'
    });
    
    // Set a simpler session cookie as backup
    Cookies.set('__session', '1', { 
      expires: expiresInDays,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Strict'
    });
    
    // Store the remember me preference
    if (rememberMe) {
      localStorage.setItem('auth_remember_me', 'true');
    } else {
      localStorage.removeItem('auth_remember_me');
    }
  } catch (error) {
    console.error('Error setting auth cookies:', error);
  }
};

export async function signInWithGoogle(setLoading: (loading: boolean) => void, rememberMe: boolean = false) {
  try {
    setLoading(true);
    
    // Set the appropriate persistence based on rememberMe option
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    
    const provider = new GoogleAuthProvider();
    
    try {
      // Try popup first (better UX when it works)
      const result = await signInWithPopup(auth, provider);
      await handleAuthResult(result, rememberMe);
    } catch (popupError: any) {
      console.log('Popup error:', popupError.code);
      
      // If popup is blocked, fall back to redirect
      if (popupError.code === 'auth/popup-blocked' || 
          popupError.code === 'auth/popup-closed-by-user') {
        console.log('Popup blocked, using redirect method...');
        // Store remember me preference in localStorage before redirect
        localStorage.setItem('auth_redirect_remember_me', rememberMe ? 'true' : 'false');
        await signInWithRedirect(auth, provider);
        return; // Function ends here, redirect happens
      } else {
        // Rethrow other errors
        throw popupError;
      }
    }
  } catch (error) {
    console.error('Auth error:', error);
    throw error;
  } finally {
    setLoading(false);
  }
}

async function handleAuthResult(result: any, rememberMe: boolean) {
  if (result && result.user) {
    // Set auth cookies with remember me preference
    await setAuthCookies(result.user, rememberMe);
    
    const userDoc = doc(db, 'users', result.user.uid);
    const docSnap = await getDoc(userDoc);
    
    if (!docSnap.exists()) {
      await setDoc(userDoc, {
        email: result.user.email,
        createdAt: serverTimestamp(),
        generationCount: 0,
        maxGenerations: 2, // Limit to 2 generations per account
      });
      window.location.href = '/subscribe';
    } else {
      window.location.href = '/dashboard';
    }
  }
}

// Check for redirect result (should be called on app init)
export async function checkRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      // Get remember me preference from localStorage
      const rememberMe = localStorage.getItem('auth_redirect_remember_me') === 'true';
      // Clean up storage
      localStorage.removeItem('auth_redirect_remember_me');
      
      // Handle the auth result
      await handleAuthResult(result, rememberMe);
    }
  } catch (error) {
    console.error('Error checking redirect result:', error);
  }
}

// Helper function to check and restore auth state
export function initializeAuth() {
  const rememberMePref = localStorage.getItem('auth_remember_me');
  
  // Check for redirect result
  checkRedirectResult();
  
  // If user previously chose "Remember me", we don't need to do anything
  // Firebase will auto-restore the session with browserLocalPersistence
  
  return {
    isRemembered: rememberMePref === 'true',
  };
}

export function signOut() {
  return auth.signOut().then(() => {
    // Clear auth cookies
    Cookies.remove('firebase-auth-token');
    Cookies.remove('__session');
    localStorage.removeItem('auth_remember_me');
    window.location.href = '/';
  });
}

// When a user refreshes their token, update the cookies
export async function refreshAuthCookies(user: any) {
  const rememberMePref = localStorage.getItem('auth_remember_me');
  await setAuthCookies(user, rememberMePref === 'true');
} 