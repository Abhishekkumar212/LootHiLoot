import React, { useState } from 'react';
import type { User } from '../types';

interface LoginProps {
  onLogin: (credentials: Pick<User, 'email' | 'password'>) => Promise<void>;
  onRegister: (newUser: Omit<User, 'uid'>) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
}

const GoogleIcon: React.FC = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
);


const Login: React.FC<LoginProps> = ({ onLogin, onRegister, onGoogleLogin }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormSwitch = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setName('');
    setEmail('');
    setPassword('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (authMode === 'login') {
      if (email && password) {
        await onLogin({ email, password });
      } else {
        alert("Please enter email and password.");
      }
    } else {
      if (email && password && name) {
        await onRegister({ name, email, password });
      } else {
        alert("Please fill in all fields.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4 bg-gradient-to-br from-primary to-secondary">
      <div className="max-w-md w-full bg-secondary p-8 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-light mb-2">Welcome to Loot Hi Loot Deals</h1>
        <p className="text-center text-highlight mb-8">
            {authMode === 'login' ? 'Sign in to track your orders' : 'Create an account to get started'}
        </p>
        
        <div className="flex bg-primary rounded-lg p-1 mb-6">
            <button 
                onClick={() => handleFormSwitch('login')}
                className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${authMode === 'login' ? 'bg-accent text-white' : 'text-highlight'}`}
            >
                Sign In
            </button>
            <button 
                onClick={() => handleFormSwitch('register')}
                className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${authMode === 'register' ? 'bg-accent text-white' : 'text-highlight'}`}
            >
                Register
            </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {authMode === 'register' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-light">Full Name</label>
              <input
                type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full bg-accent border border-gray-600 rounded-md shadow-sm py-3 px-4 text-light focus:outline-none focus:ring-highlight focus:border-highlight"
                placeholder="John Doe" required disabled={loading}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-light">Email Address</label>
            <input
              type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full bg-accent border border-gray-600 rounded-md shadow-sm py-3 px-4 text-light focus:outline-none focus:ring-highlight focus:border-highlight"
              placeholder="you@example.com" required disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password"  className="block text-sm font-medium text-light">Password</label>
            <input
              type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full bg-accent border border-gray-600 rounded-md shadow-sm py-3 px-4 text-light focus:outline-none focus:ring-highlight focus:border-highlight"
              placeholder="••••••••" required disabled={loading}
            />
          </div>
          <div>
             <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-highlight hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:scale-100">
                {loading ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </div>
        </form>

        <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-highlight text-sm">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <div>
            <button
                type="button"
                onClick={onGoogleLogin}
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-600 rounded-md shadow-sm text-base font-medium text-light bg-secondary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary focus:ring-white transition-all transform hover:scale-105 disabled:opacity-50"
            >
                <GoogleIcon />
                {authMode === 'login' ? 'Sign In with Google' : 'Register with Google'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default Login;
