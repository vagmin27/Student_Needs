import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * ProfileForm Component
 * Displays and handles basic student profile information.
 * * @param {Object} props
 * @param {Object} props.formData - The current state of the form
 * @param {string} props.formData.name
 * @param {string} props.formData.email
 * @param {string} props.formData.college
 * @param {string} props.formData.department
 * @param {number} props.formData.graduationYear
 * @param {Function} props.setFormData - State setter to update form data
 * @param {Object|null} props.student - Current student profile from the database/blockchain
 */
export function ProfileForm({ formData, setFormData, student }) {
  // Helper to check if fields should be read-only (e.g., after resume is verified/hashed)
  const isLocked = !!student?.resumeHash;

  return (
    <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Profile Information
      </h3>
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className='flex flex-col items-start gap-2'>
            <Label htmlFor="name" className='ml-1'>Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              disabled={isLocked}
            />
          </div>
          
          {/* Email */}
          <div className='flex flex-col items-start gap-2'>
            <Label htmlFor="email" className='ml-1'>Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@college.edu"
              disabled={isLocked}
            />
          </div>
        </div>

        {/* College */}
        <div className='flex flex-col items-start gap-2'>
          <Label htmlFor="college" className='ml-1'>College</Label>
          <Input
            id="college"
            value={formData.college}
            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
            placeholder="State University"
            disabled={isLocked}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Department */}
          <div className='flex flex-col items-start gap-2'>
            <Label htmlFor="department" className='ml-1'>Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="Computer Science"
              disabled={isLocked}
            />
          </div>

          {/* Graduation Year */}
          <div className='flex flex-col items-start gap-2'>
            <Label htmlFor="year" className='ml-1'>Graduation Year</Label>
            <Input
              id="year"
              type="number"
              value={formData.graduationYear}
              onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) || 0 })}
              disabled={isLocked}
            />
          </div>
        </div>
      </div>
    </div>
  );
}