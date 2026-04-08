import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowLeft, Loader2 } from 'lucide-react';
import { useStudentSignup } from '../../../services/Auth/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Student Signup Page Component
 * Handles the registration process for new student users.
 */
export function StudentSignupPage() {
  const {
    data,
    errors,
    isSubmitting,
    submitError,
    setField,
    handleSubmit,
  } = useStudentSignup();

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
        <Link 
          to="/role-selector" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Role Selection
        </Link>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                < GraduationCap className="w-6 h-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Create Student Account</CardTitle>
            <CardDescription>Enter your details to get started</CardDescription>
          </CardHeader>

          <CardContent>
            {submitError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={data.firstName}
                    onChange={(e) => setField('firstName', e.target.value)}
                    placeholder="John"
                    disabled={isSubmitting}
                    className={errors.firstName ? 'border-destructive' : ''}
                  />
                  {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={data.lastName}
                    onChange={(e) => setField('lastName', e.target.value)}
                    placeholder="Doe"
                    disabled={isSubmitting}
                    className={errors.lastName ? 'border-destructive' : ''}
                  />
                  {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setField('email', e.target.value)}
                  placeholder="john.doe@college.edu"
                  disabled={isSubmitting}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              {/* Password */}
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

              {/* College Name */}
              <div className="space-y-2">
                <Label htmlFor="collegeName">College Name</Label>
                <Input
                  id="collegeName"
                  type="text"
                  value={data.collegeName}
                  onChange={(e) => setField('collegeName', e.target.value)}
                  placeholder="MIT, Stanford, etc."
                  disabled={isSubmitting}
                  className={errors.collegeName ? 'border-destructive' : ''}
                />
                {errors.collegeName && <p className="text-xs text-destructive">{errors.collegeName}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/auth/student/login" className="text-primary font-medium hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}