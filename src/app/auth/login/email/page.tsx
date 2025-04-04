'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Dynamic particle animation component
const ParticleField = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-500/20"
          initial={{ 
            opacity: 0.1 + Math.random() * 0.3, 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            scale: 0.1 + Math.random() * 0.5,
          }}
          animate={{ 
            x: [null, `${Math.random() * 20 - 10 + parseFloat(i % 2 ? "-5%" : "5%")}`],
            y: [null, `${Math.random() * 20 - 10 + parseFloat(i % 2 ? "5%" : "-5%")}`], 
          }}
          transition={{ 
            duration: 3 + Math.random() * 5, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{
            width: `${(i % 3) * 3 + 5}px`,
            height: `${(i % 3) * 3 + 5}px`,
          }}
        />
      ))}
    </div>
  );
};

export default function EmailLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Mount animations
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login (replace with actual login logic)
    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex overflow-hidden">
      {/* Background particle effect */}
      {mounted && <ParticleField />}
      
      {/* Full width content for mobile, centered for desktop */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="mx-auto w-full max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <Link href="/" className="inline-block">
              <motion.span 
                className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Ventry
              </motion.span>
            </Link>
            <motion.h2 
              className="mt-6 text-3xl font-bold text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Sign in to your account
            </motion.h2>
            <motion.p 
              className="mt-2 text-sm text-blue-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Or{' '}
              <Link href="/auth/login" className="font-medium text-blue-500 hover:text-blue-400 transition-colors">
                use another sign in method
              </Link>
            </motion.p>
          </div>

          <motion.div 
            className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-800/50 relative overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Card background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-indigo-900/5"></div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            
            {/* Form content */}
            <form onSubmit={handleLogin} className="relative space-y-6 z-10">
              {/* Email Field */}
              <div>
                <motion.label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-300 mb-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  Email address
                </motion.label>
                <motion.div
                  className="relative mt-1 rounded-md shadow-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 bg-gray-800/80 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="you@example.com"
                  />
                </motion.div>
              </div>

              {/* Password Field */}
              <div>
                <motion.label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-300 mb-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  Password
                </motion.label>
                <motion.div
                  className="relative mt-1 rounded-md shadow-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 bg-gray-800/80 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-300 focus:outline-none"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Remember me and forgot password */}
              <div className="flex items-center justify-between">
                <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.9 }}
                >
                  <div className="relative">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="h-5 w-5 border border-gray-600 rounded-md bg-gray-800/80 peer-checked:bg-blue-600 peer-checked:border-blue-500 transition-colors">
                      <div className="flex items-center justify-center h-full w-full opacity-0 peer-checked:opacity-100 transition-opacity">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300 cursor-pointer">
                    Remember me
                  </label>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 1 }}
                >
                  <Link href="/auth/reset-password" className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">
                    Forgot your password?
                  </Link>
                </motion.div>
              </div>

              {/* Login Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full flex justify-center py-2.5 px-4 rounded-lg overflow-hidden group shadow-lg"
                >
                  {/* Button background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:opacity-90"></div>
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
                  
                  {/* Button hover effect */}
                  <div className="absolute inset-0 w-full h-full">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 bg-gradient-to-r from-blue-400/40 to-indigo-400/40 blur-xl"></div>
                  </div>
                  
                  {/* Button border gradient */}
                  <div className="absolute inset-0 rounded-lg p-px bg-gradient-to-r from-blue-400/50 via-indigo-400/50 to-blue-400/50 opacity-40 group-hover:opacity-80 transition-opacity"></div>
                  
                  {/* Button content */}
                  <span className="relative text-white font-medium">
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </span>
                </button>
              </motion.div>
            </form>
          </motion.div>

          {/* Sign up link */}
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="font-medium text-blue-500 hover:text-blue-400 transition-colors">
                Sign up
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 