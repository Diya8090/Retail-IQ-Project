import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { registerSchema } from '@/validations';
import { useAuth } from '@/contexts/AuthContext';

export const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setAuthError('');
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate('/dashboard');
    } catch (err) {
      setAuthError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create an account</h2>
        <p className="text-xs text-slate-500">
          Get started with your 14-day full featured enterprise trial.
        </p>
      </div>

      {authError && (
        <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{authError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="e.g. Alex Rivera"
          leadingIcon={User}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Work Email"
          type="email"
          placeholder="name@company.com"
          leadingIcon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="At least 6 characters"
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

        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Re-enter password"
          leadingIcon={Lock}
          error={errors.confirmPassword?.message}
          trailingIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="hover:text-slate-600 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          {...register('confirmPassword')}
        />

        <div className="space-y-1">
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              {...register('agreeTerms')}
            />
            <span className="text-xs text-slate-600">
              I agree to the{' '}
              <a href="#terms" className="text-indigo-600 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" className="text-indigo-600 underline">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-xs text-rose-600 font-medium">{errors.agreeTerms.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full h-10 mt-2" isLoading={isSubmitting}>
          Create RetailIQ Account
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};
