import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Building2, LogIn, ArrowLeft } from 'lucide-react';
import type { User, Company } from '../App';
import { login } from '../api';
import { toast } from 'sonner';

interface LoginPageProps {
  onLogin: (user: User) => void;
  company: Company;
  onBackToCompanies: () => void;
}

// Mock users for demo
const createMockUsers = (companyId: string) => ({
  ceo: { id: '1', companyId, name: 'Ellen CEO', email: 'ceo@techhub.com', role: 'ceo' as const },
  discipline: { id: '2', companyId, name: 'John Discipline', email: 'discipline@techhub.com', role: 'discipline' as const },
  committee: { id: '3', companyId, name: 'Jane Committee', email: 'committee@techhub.com', role: 'committee' as const },
  member: { id: '4', companyId, name: 'Mike Member', email: 'member@techhub.com', role: 'member' as const },
});

export function LoginPage({ onLogin, company, onBackToCompanies }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const mockUsers = createMockUsers(company.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      // Try real authentication first
      const response = await login(email, password);
      onLogin(response.user);
      toast.success(`Welcome back, ${response.user.name}!`);
    } catch (error) {
      // If real auth fails, fall back to mock for demo purposes
      if (selectedRole && mockUsers[selectedRole as keyof typeof mockUsers]) {
        const user = mockUsers[selectedRole as keyof typeof mockUsers];
        if (user.email === email) {
          onLogin(user);
          toast.success(`Demo login successful as ${user.name}!`);
          return;
        }
      }
      toast.error('Invalid email or password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: keyof typeof mockUsers) => {
    onLogin(mockUsers[role]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          onClick={onBackToCompanies}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Organizations
        </Button>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl mb-2">{company.name}</h1>
          <p className="text-lg text-muted-foreground">
            Sign in to access your portal
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Select Role (Optional - for demo only)</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Auto-detected from credentials" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ceo">CEO</SelectItem>
                    <SelectItem value="discipline">Discipline</SelectItem>
                    <SelectItem value="committee">Committee</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                <LogIn className="h-4 w-4 mr-2" />
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Demo Quick Login</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleQuickLogin('ceo')}
                >
                  Login as CEO
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleQuickLogin('discipline')}
                >
                  Login as Discipline
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleQuickLogin('committee')}
                >
                  Login as Committee
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleQuickLogin('member')}
                >
                  Login as Member
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Forgot your password? Contact your administrator
        </p>
      </div>
    </div>
  );
}
