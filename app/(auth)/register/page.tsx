'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) throw error;
      
      router.push('/analyze');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-normal text-gray-900 mb-1 tracking-tight">
            AI Research Judgment Platform
          </h1>
          <p className="text-lg text-gray-700 mb-2 tracking-wide">PAPA ATTANASI</p>
          <p className="text-sm text-gray-600 font-light">Multi-Model Research Tool</p>
        </div>
        
        <div className="bg-white border border-gray-300 p-8">
          <h2 className="text-xl font-normal text-gray-900 mb-6">Create Account</h2>
          
          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-500"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-500"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-500"
                placeholder="Minimum 6 characters"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white text-sm font-normal transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-gray-900 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
          
          {/* Footer Credits */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2 font-light">Project funded by</p>
                <a href="https://agentics.eu.com" aria-label="Agentics website">
                  <img 
                    src="/agentics-logo.svg" 
                    alt="Agentics" 
                    className="h-8 mx-auto"
                  />
                </a>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2 font-light">API Credits</p>
                <p className="text-xs text-gray-700">OpenAI, Anthropic,<br/>Moonshot, DeepSeek</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2 font-light">Project Developer</p>
                <p className="text-xs text-gray-700">Lorenzo Balduzzi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
