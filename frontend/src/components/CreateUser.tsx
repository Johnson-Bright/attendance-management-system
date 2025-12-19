import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { Company, User } from '../App';
import { createUser } from '../api';
import { toast } from 'sonner';

interface CreateUserProps {
  company: Company;
}

export function CreateUser({ company }: CreateUserProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<User['role']>('member');
  const [loading, setLoading] = useState(false);
  const disabled = !name || !email || !password || !role || loading;

  const onSubmit = async () => {
    setLoading(true);
    try {
      await createUser({ companyId: company.id, name, email, role, password });
      toast.success(`User ${name} created successfully with ${role} role!`);
      setName('');
      setEmail('');
      setPassword('');
      setRole('member');
    } catch (error) {
      toast.error('Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create User Account</CardTitle>
        <CardDescription>Enter details and assign a role</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <label className="text-sm">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email@example.com" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Password</label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter password" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Role</label>
          <Select value={role} onValueChange={(v) => setRole(v as User['role'])}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ceo">CEO</SelectItem>
              <SelectItem value="discipline">Discipline</SelectItem>
              <SelectItem value="committee">Committee</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onSubmit} disabled={disabled}>
          {loading ? 'Creating...' : 'Create User'}
        </Button>
      </CardContent>
    </Card>
  );
}
