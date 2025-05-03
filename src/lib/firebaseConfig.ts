// This is a placeholder for the Firebase configuration
// Vercel deployments will use environment variables for the real configuration

// Mock auth and db for build process
export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: any) => {
    return () => {}; // Unsubscribe function
  },
};

export const db = {
  collection: () => ({
    doc: () => ({
      get: async () => ({
        exists: false,
        data: () => ({}),
      }),
      set: async () => {},
    }),
  }),
};

// Export placeholder functions to avoid build errors
export const getFirestore = () => db;
export const getAuth = () => auth; 