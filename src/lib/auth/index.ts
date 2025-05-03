// Simplified auth library that doesn't depend on Firebase for build

// Mock auth functions for deployment
export function signInWithGoogle(setLoading: (loading: boolean) => void, rememberMe: boolean = false) {
  try {
    setLoading(true);
    
    // Simulate auth flow
    console.log('Mock Google sign-in for build');
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Auth error:', error);
    return Promise.reject(error);
  } finally {
    setLoading(false);
  }
}

// Mock functions
export async function checkRedirectResult() {
  return Promise.resolve(null);
}

export function initializeAuth() {
  return {
    isRemembered: false,
  };
}

export function signOut() {
  console.log('Mock sign out');
  window.location.href = '/';
  return Promise.resolve();
}

export async function refreshAuthCookies(user: any) {
  return Promise.resolve();
} 