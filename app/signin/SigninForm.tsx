'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Car, Lock, Mail, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const signinSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  rememberMe: z.boolean().optional(),
});

type SigninFormData = z.infer<typeof signinSchema>;

export default function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: SigninFormData) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setErrorMsg(result.error || 'Sign in failed.');
        setIsSubmitting(false);
        return;
      }
      window.location.href = '/dashboard';
    } catch {
      setErrorMsg('Could not reach the server. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-bg-custom to-accent/5 p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />

      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center space-x-2 text-sm font-semibold text-primary hover:text-primary-hover bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm transition-all hover:-translate-x-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-[32px] border border-slate-100 shadow-2xl p-8 sm:p-10 relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 mb-3">
            <Car className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-2xl font-extrabold text-primary font-heading tracking-tight">
            Portal Sign In
          </h2>
          <p className="text-xs text-text-secondary mt-1 font-medium">
            Admin can edit · Shareholders can view only
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-danger/5 border border-danger/20 text-danger text-xs font-bold flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold text-primary uppercase">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                id="email"
                type="email"
                placeholder="admin@ghorahiedrive.com"
                {...register('email')}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-danger font-semibold flex items-center mt-1">
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-bold text-primary uppercase">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-danger font-semibold flex items-center mt-1">
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              {...register('rememberMe')}
              className="w-4.5 h-4.5 text-primary border-slate-300 rounded focus:ring-primary focus:ring-2 focus:ring-offset-0"
            />
            <label htmlFor="rememberMe" className="ml-2 text-xs font-semibold text-text-secondary cursor-pointer">
              Remember me on this device
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:bg-slate-300 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-bold text-primary hover:text-primary-hover underline-offset-2 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
