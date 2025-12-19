import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { UserPlus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Member, Company } from '../App';

interface MemberManagementProps {
  company: Company;
  members: Member[];
  onAddMember: (member: Omit<Member, 'id' | 'companyId'>) => void;
  onUpdateMember: (memberId: string, member: Partial<Member>) => void;
  onDeleteMember: (memberId: string) => void;
}

export function MemberManagement({ company, members, onAddMember, onUpdateMember, onDeleteMember }: MemberManagementProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    department: '',
    joinedYear: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.registrationNumber.trim() || !formData.department.trim() || !formData.joinedYear.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingMember) {
      onUpdateMember(editingMember.id, formData);
      toast.success('Member updated successfully!');
      setEditingMember(null);
    } else {
      onAddMember(formData);
      toast.success('Member added successfully!');
      setIsAddOpen(false);
    }

    setFormData({
      name: '',
      registrationNumber: '',
      department: '',
      joinedYear: '',
      email: '',
    });
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      registrationNumber: member.registrationNumber,
      department: member.department,
      joinedYear: member.joinedYear,
      email: member.email || '',
    });
    setIsAddOpen(true);
  };

  const handleDelete = (memberId: string, memberName: string) => {
    if (confirm(`Are you sure you want to delete ${memberName}?`)) {
      onDeleteMember(memberId);
      toast.success('Member deleted successfully!');
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Member Management</CardTitle>
              <CardDescription>
                Add and manage members for {company.name}
              </CardDescription>
            </div>
            <Dialog open={isAddOpen} onOpenChange={(open) => {
              setIsAddOpen(open);
              if (!open) {
                setEditingMember(null);
                setFormData({
                  name: '',
                  registrationNumber: '',
                  department: '',
                  joinedYear: '',
                  email: '',
                });
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingMember ? 'Edit Member' : 'Add New Member'}</DialogTitle>
                  <DialogDescription>
                    {editingMember ? 'Update member information' : 'Register a new member to the organization'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter member name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regNum">Registration Number *</Label>
                    <Input
                      id="regNum"
                      placeholder="REG001"
                      value={formData.registrationNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Input
                      id="department"
                      placeholder="e.g., Engineering, Marketing"
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Joined Year *</Label>
                    <Input
                      id="year"
                      placeholder="2024"
                      value={formData.joinedYear}
                      onChange={(e) => setFormData(prev => ({ ...prev, joinedYear: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="member@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingMember ? 'Update Member' : 'Add Member'}
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
                placeholder="Search members by name, registration number, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchQuery ? 'No members found matching your search.' : 'No members registered yet. Click "Add New Member" to get started.'}
              </div>
            ) : (
              filteredMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p>{member.name}</p>
                            <Badge variant="outline">{member.registrationNumber}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {member.department} • Joined {member.joinedYear}
                          </p>
                          {member.email && (
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(member.id, member.name)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
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
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Members</p>
              <p className="text-2xl">{members.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Departments</p>
              <p className="text-2xl">{new Set(members.map(m => m.department)).size}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">This Year</p>
              <p className="text-2xl">
                {members.filter(m => m.joinedYear === new Date().getFullYear().toString()).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
