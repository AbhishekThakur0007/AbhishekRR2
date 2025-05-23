'use client';

import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';
import { useState } from 'react';

interface LoginFormProps extends React.ComponentProps<'div'> {
  onEmailLogin?: (email: string, password: string) => Promise<void>;
  onGoogleLogin?: () => Promise<void>;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  redirectAfterLogin?: string;
  backgroundImage?: string;
  title?: string;
  subtitle?: string;
}

export function LoginForm({
  className,
  onEmailLogin,
  onGoogleLogin,
  onForgotPassword,
  onSignUp,
  backgroundImage = '/pic.avif',
  title = 'Welcome back',
  subtitle = 'Login to your account',
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onEmailLogin) return;

    setLoading(true);
    setError(null);

    try {
      await onEmailLogin(email, password);
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!onGoogleLogin) return;

    try {
      await onGoogleLogin();
    } catch (error: any) {
      setError(error.message || 'An error occurred during Google login');
    }
  };
  
  // return <></>
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleEmailLogin}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-balance text-muted-foreground">{subtitle}</p>
              </div>
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      onForgotPassword?.();
                    }}
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <a
                  href="#"
                  className="underline underline-offset-4"
                  onClick={(e) => {
                    e.preventDefault();
                    onSignUp?.();
                  }}
                >
                  Sign up
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={backgroundImage}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
