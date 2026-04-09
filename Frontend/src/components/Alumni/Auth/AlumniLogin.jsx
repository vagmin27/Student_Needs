import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, ArrowLeft, Loader2 } from 'lucide-react';
import { useAlumniLogin } from '../../../services/Auth/hooks';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';

/**
 * Alumni Login Page Component
 * Handles user authentication for Alumni accounts.
 */
export function AlumniLoginPage() {
  const {
    data,
    errors,
    isSubmitting,
    submitError,
    setField,
    handleSubmit,
  } = useAlumniLogin();

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Role Selection
        </Link>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Alumni Login</CardTitle>
            <CardDescription>Welcome back! Login to your account</CardDescription>
          </CardHeader>

          <CardContent>
            {submitError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setField('email', e.target.value)}
                  placeholder="john.doe@company.com"
                  disabled={isSubmitting}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setField('password', e.target.value)}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className={errors.password ? 'border-destructive' : ''}
                />
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/auth/alumni/signup" className="text-primary font-medium hover:underline">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}