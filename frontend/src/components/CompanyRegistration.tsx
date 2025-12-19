import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Company } from '../App';

interface CompanyRegistrationProps {
  onRegister: (company: Omit<Company, 'id' | 'createdAt'>) => void;
  onBack: () => void;
}

export function CompanyRegistration({ onRegister, onBack }: CompanyRegistrationProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: '',
    description: '',
    location: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || 
        !formData.type.trim() || !formData.description.trim() || !formData.location.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate phone format (basic check)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    onRegister(formData);
    toast.success('Organization registered successfully!');
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">Novilo - Register Organization</h1>
                <p className="text-xs text-muted-foreground">Smart Management Made Easy</p>
              </div>
            </div>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
              <CardDescription>
                Please provide details about your organization. All fields are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your organization name"
                    value={formData.name}
                    onChange={handleChange('name')}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    The official name of your organization
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Organization Type *</Label>
                  <Input
                    id="type"
                    placeholder="e.g., Technology Company, Non-Profit, Educational Institute"
                    value={formData.type}
                    onChange={handleChange('type')}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    What kind of organization is this?
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">What Does Your Organization Do? *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your organization's mission, activities, and purpose..."
                    value={formData.description}
                    onChange={handleChange('description')}
                    rows={4}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide a brief description of your organization's activities
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Organization Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@organization.com"
                      value={formData.email}
                      onChange={handleChange('email')}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Official contact email
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Admin contact number
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Place of Residence/Location *</Label>
                  <Input
                    id="location"
                    placeholder="City, State/Province, Country"
                    value={formData.location}
                    onChange={handleChange('location')}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Physical location or headquarters
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-sm mb-2">Next Steps</h3>
                  <p className="text-sm text-muted-foreground">
                    After registration, you'll be directed to create your admin account and set up 
                    initial user accounts including CEO and committee members.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Register Organization
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Why Register?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Complete member management system</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Automated attendance tracking and reporting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Case management and disciplinary tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Announcements and communication system</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Role-based access control (CEO, Committee, Discipline, Member)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Secure, isolated data for your organization</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}