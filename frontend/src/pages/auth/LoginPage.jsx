import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Store, LineChart, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { loginSchema } from '@/validations';
import { useAuth } from '@/contexts/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmailSent, setForgotEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@retailiq.io',
      password: 'password123',
      rememberMe: true,
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setAuthError('');
      await login(data);
      navigate('/dashboard');
    } catch (err) {
      setAuthError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (roleEmail, roleName) => {
    setValue('email', roleEmail);
    setValue('password', 'password123');
    try {
      setIsSubmitting(true);
      setAuthError('');
      await login({ email: roleEmail, password: 'password123', role: roleName });
      navigate('/dashboard');
    } catch (err) {
      setAuthError(err.message || 'Demo login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div className="space-y-1 text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
        <p className="text-xs text-slate-500">
          Enter your credentials to access your retail analytics portal.
        </p>
      </div>

      {authError && (
        <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{authError}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Work Email"
          type="email"
          placeholder="name@company.com"
          leadingIcon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            leadingIcon={Lock}
            error={errors.password?.message}
            trailingIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            {...register('password')}
          />

          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                {...register('rememberMe')}
              />
              <span className="text-xs text-slate-600">Remember this device</span>
            </label>

            <button
              type="button"
              onClick={() => setIsForgotModalOpen(true)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full h-10 mt-2" isLoading={isSubmitting}>
          Sign in to Dashboard
        </Button>
      </form>

      {/* Demo Credentials Helper Box */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">Quick Demo Presets:</span>
          <span className="text-[10px] text-slate-400 font-medium">Click to log in instantly</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('admin@retailiq.io', 'Admin')}
            className="flex flex-col items-center justify-center p-2 rounded-lg border border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 text-purple-700 text-xs font-medium transition-all"
          >
            <ShieldCheck className="h-4 w-4 mb-1 text-purple-600" />
            Admin
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('manager@retailiq.io', 'Store Manager')}
            className="flex flex-col items-center justify-center p-2 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-blue-700 text-xs font-medium transition-all"
          >
            <Store className="h-4 w-4 mb-1 text-blue-600" />
            Manager
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('analyst@retailiq.io', 'Sales Analyst')}
            className="flex flex-col items-center justify-center p-2 rounded-lg border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-700 text-xs font-medium transition-all"
          >
            <LineChart className="h-4 w-4 mb-1 text-emerald-600" />
            Analyst
          </button>
        </div>
      </div>

      {/* Footer Register Link */}
      <p className="text-center text-xs text-slate-500">
        Don&apos;t have an enterprise account?{' '}
        <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
          Create an account
        </Link>
      </p>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => {
          setIsForgotModalOpen(false);
          setForgotEmailSent(false);
        }}
        title="Reset your password"
        description="Enter your corporate email address to receive password reset instructions."
      >
        {forgotEmailSent ? (
          <div className="py-4 text-center space-y-3">
            <div className="h-10 w-10 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Mail className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Password reset link sent!</p>
            <p className="text-xs text-slate-500">
              Check your inbox for a link to securely reset your password. In this demo, use the quick demo presets.
            </p>
            <Button
              className="w-full mt-2"
              variant="outline"
              onClick={() => {
                setIsForgotModalOpen(false);
                setForgotEmailSent(false);
              }}
            >
              Back to Login
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <Input label="Email address" type="email" placeholder="admin@retailiq.io" defaultValue="admin@retailiq.io" />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsForgotModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => setForgotEmailSent(true)}>
                Send Reset Link
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
