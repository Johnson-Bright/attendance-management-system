import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UserPlus, Search, Shield, Users, Crown, Gavel } from 'lucide-react';
import { toast } from 'sonner';
import type { User, Company } from '../App';
import { getUsers, createUser } from '../api';

interface UserManagementProps {
  company: Company;
}

export function UserManagement({ company }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member' as User['role'],
  });

  useEffect(() => {
    loadUsers();
  }, [company.id]);

  const loadUsers = async () => {
    try {
      const userList = await getUsers(company.id);
      setUsers(userList);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const newUser = await createUser({
        companyId: company.id,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password,
      });
      
      setUsers(prev => [...prev, newUser]);
      toast.success(`User ${formData.name} created successfully!`);
      setIsAddOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'member',
      });
    } catch (error) {
      toast.error('Failed to create user. Email might already exist.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'ceo': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'discipline': return <Gavel className="h-4 w-4 text-red-600" />;
      case 'committee': return <Shield className="h-4 w-4 text-blue-600" />;
      default: return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadgeVariant = (role: User['role']) => {
    switch (role) {
      case 'ceo': return 'default';
      case 'discipline': return 'destructive';
      case 'committee': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">How User Login Works</CardTitle>
          <CardDescription className="text-blue-600">
            When you create a user with login credentials, they can use those credentials to log into the system:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• <strong>Create User:</strong> Fill out the form below with name, email, password, and role</p>
            <p>• <strong>Share Credentials:</strong> Give the user their email and password</p>
            <p>• <strong>User Login:</strong> They can log in at the main login page using their credentials</p>
            <p>• <strong>Auto Role Detection:</strong> The system automatically assigns them to the correct dashboard based on their role</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Create and manage user accounts with login credentials for {company.name}
              </CardDescription>
            </div>
            <Dialog open={isAddOpen} onOpenChange={(open) => {
              setIsAddOpen(open);
              if (!open) {
                setFormData({
                  name: '',
                  email: '',
                  password: '',
                  role: 'member',
                });
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create New User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account with login credentials and assign a role
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter secure password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as User['role'] }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="committee">Committee</SelectItem>
                        <SelectItem value="discipline">Discipline</SelectItem>
                        <SelectItem value="ceo">CEO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating User...' : 'Create User'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchQuery ? 'No users found matching your search.' : 'No users found. Click "Create New User" to get started.'}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{user.name}</p>
                            <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1">
                              {getRoleIcon(user.role)}
                              {user.role.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          {user.suspended && (
                            <Badge variant="destructive" className="mt-1">
                              Suspended
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Users</p>
              <p className="text-2xl">{users.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">CEOs</p>
              <p className="text-2xl">{users.filter(u => u.role === 'ceo').length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Committee</p>
              <p className="text-2xl">{users.filter(u => u.role === 'committee').length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Members</p>
              <p className="text-2xl">{users.filter(u => u.role === 'member').length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}