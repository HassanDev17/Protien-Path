import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-background">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm"
            >
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md">
                    <CardHeader className="space-y-1 text-center">
                        <h1 className="text-3xl font-bold text-rose-500 mb-2">Protein Path</h1>
                        <CardTitle className="text-xl font-semibold text-gray-800">
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </CardTitle>
                        <CardDescription>
                            {isSignUp
                                ? 'Enter your details to create a new account'
                                : 'Enter your credentials to access your account'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAuth} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && (
                                <div className="text-sm text-red-500 font-medium">
                                    {error}
                                </div>
                            )}
                            <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {isSignUp ? 'Creating...' : 'Signing in...'}
                                    </>
                                ) : (
                                    isSignUp ? 'Sign Up' : 'Sign In'
                                )}
                            </Button>
                        </form>
                        <div className="mt-4 text-center text-sm">
                            <span className="text-gray-500">
                                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-rose-500 hover:underline font-medium focus:outline-none"
                            >
                                {isSignUp ? 'Sign in' : 'Sign up'}
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};
