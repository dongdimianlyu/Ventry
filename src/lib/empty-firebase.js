// Empty Firebase modules to prevent build errors
const mockAuth = {
  currentUser: null,
  onAuthStateChanged: (callback) => {
    callback(null);
    return () => {};
  },
  signInWithPopup: async () => ({ user: null }),
  signInWithRedirect: async () => {},
  signOut: async () => {},
  getRedirectResult: async () => null,
};

const mockDb = {
  collection: () => ({
    doc: () => ({
      get: async () => ({
        exists: false,
        data: () => ({}),
      }),
      set: async () => {},
      update: async () => {},
    }),
  }),
};

// Export mock Firebase functions
module.exports = {
  // Auth exports
  getAuth: () => mockAuth,
  onAuthStateChanged: (auth, callback) => {
    setTimeout(() => callback(null), 100);
    return () => {};
  },
  signInWithPopup: async () => ({ user: null }),
  signInWithRedirect: async () => {},
  signOut: async () => {},
  GoogleAuthProvider: function() {},
  getRedirectResult: async () => null,
  browserLocalPersistence: 'local',
  browserSessionPersistence: 'session',
  setPersistence: async () => {},
  
  // Firestore exports
  getFirestore: () => mockDb,
  doc: () => ({
    get: async () => ({
      exists: false,
      data: () => ({}),
    }),
    set: async () => {},
    update: async () => {},
  }),
  getDoc: async () => ({
    exists: false,
    data: () => ({}),
  }),
  setDoc: async () => {},
  updateDoc: async () => {},
  collection: () => ({
    get: async () => ({
      docs: [],
      forEach: () => {},
    }),
  }),
  getDocs: async () => ({
    docs: [],
    forEach: () => {},
  }),
  serverTimestamp: () => new Date().toISOString(),
  increment: (n) => n,
  
  // Auth types
  User: class {
    constructor() {
      this.uid = 'mock-uid';
      this.email = 'mock@example.com';
    }
  },
  
  // Firebase app
  initializeApp: () => ({
    auth: mockAuth,
    firestore: mockDb,
  }),

  // New functions from the code block
  signInWithEmailAndPassword: () => Promise.resolve({}),
  createUserWithEmailAndPassword: () => Promise.resolve({}),
  addDoc: () => Promise.resolve({ id: 'mock-id' }),
  deleteDoc: () => Promise.resolve({}),
  query: () => ({}),
  where: () => ({}),
  limit: () => ({}),
  orderBy: () => ({}),
  default: {
    apps: [],
    initializeApp: () => ({})
  }
}; 