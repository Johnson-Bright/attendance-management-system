import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Building2, ArrowRight, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner';
import type { Company } from '../App';

interface CompanyPortalProps {
  companies: Company[];
  onCompanySelect: (company: Company) => void;
  onCompanyRegister: (company: Omit<Company, 'id' | 'createdAt'>) => void;
}

export function CompanyPortal({ companies, onCompanySelect, onCompanyRegister }: CompanyPortalProps) {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName.trim() || !companyEmail.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    onCompanyRegister({
      name: companyName.trim(),
      email: companyEmail.trim(),
    });

    setCompanyName('');
    setCompanyEmail('');
    setIsRegisterOpen(false);
    toast.success('Company registered successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl mb-2">Organization Management System</h1>
          <p className="text-lg text-muted-foreground">
            Select your organization or register a new one
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Select Organization</CardTitle>
                <CardDescription>Choose your organization to access the portal</CardDescription>
              </div>
              <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Register New Organization
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Register New Organization</DialogTitle>
                    <DialogDescription>
                      Create a new organization portal for your team
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Organization Name *</Label>
                      <Input
                        id="companyName"
                        placeholder="Enter organization name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyEmail">Organization Email *</Label>
                      <Input
                        id="companyEmail"
                        type="email"
                        placeholder="admin@organization.com"
                        value={companyEmail}
                        onChange={(e) => setCompanyEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Register Organization
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {companies.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No organizations registered yet. Click "Register New Organization" to get started.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {companies.map((company) => (
                  <Card 
                    key={company.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
                    onClick={() => onCompanySelect(company)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                              <Building2 className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="mb-1">{company.name}</h3>
                              <p className="text-sm text-muted-foreground">{company.email}</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Registered: {new Date(company.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Each organization has its own secure portal with role-based access control
        </p>
      </div>
    </div>
  );
}
