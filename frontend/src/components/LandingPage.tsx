import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Building2, Users, ClipboardCheck, Shield, ArrowRight, Menu, X, FileText, Plus } from 'lucide-react';
import type { Company } from '../App';

interface LandingPageProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
  onNavigateToRegister: () => void;
  onNavigateToRecorder: () => void;
}

export function LandingPage({ companies, onSelectCompany, onNavigateToRegister, onNavigateToRecorder }: LandingPageProps) {
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'contact'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">Novilo</h1>
                <p className="text-xs text-muted-foreground">Smart Management Made Easy</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setCurrentPage('home')}
                className={`text-sm transition-colors ${
                  currentPage === 'home' ? 'text-blue-600' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage('about')}
                className={`text-sm transition-colors ${
                  currentPage === 'about' ? 'text-blue-600' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                About Us
              </button>
              <button
                onClick={() => setCurrentPage('contact')}
                className={`text-sm transition-colors ${
                  currentPage === 'contact' ? 'text-blue-600' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Contact Us
              </button>
              <Button onClick={onNavigateToRecorder} variant="outline">
                Quick Recorder
              </Button>
              <Button onClick={onNavigateToRegister}>
                Register Organization
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t space-y-2">
              <button
                onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-muted rounded"
              >
                Home
              </button>
              <button
                onClick={() => { setCurrentPage('about'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-muted rounded"
              >
                About Us
              </button>
              <button
                onClick={() => { setCurrentPage('contact'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-muted rounded"
              >
                Contact Us
              </button>
              <Button onClick={onNavigateToRecorder} variant="outline" className="w-full">
                Quick Recorder
              </Button>
              <Button onClick={onNavigateToRegister} className="w-full">
                Register Organization
              </Button>
            </nav>
          )}
        </div>
      </header>

      {/* Page Content */}
      <main className="container mx-auto px-4 py-12">
        {currentPage === 'home' && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl mb-4">
                Complete Organizational Management Solution
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                Streamline your organization's operations with our comprehensive management system. 
                Track attendance, manage members, handle permissions, create announcements, and maintain 
                discipline - all in one powerful platform.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>Member Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Add, edit, and manage all organization members with detailed profiles and role assignments.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <ClipboardCheck className="h-10 w-10 text-green-600 mb-2" />
                  <CardTitle>Attendance Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Mark and monitor attendance with comprehensive reports and analytics for better insights.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="h-10 w-10 text-purple-600 mb-2" />
                  <CardTitle>Case Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Handle disciplinary cases, track resolutions, and maintain organizational standards.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Building2 className="h-10 w-10 text-orange-600 mb-2" />
                  <CardTitle>Multi-Tenant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Each organization gets its own secure portal with complete data isolation.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Organizations Section */}
            <div>
              <h3 className="text-3xl mb-2 text-center">Registered Organizations</h3>
              <p className="text-muted-foreground text-center mb-8">
                Select your organization to access your portal
              </p>

              {companies.length === 0 ? (
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="py-12 text-center">
                    <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg mb-4">No organizations registered yet</p>
                    <Button onClick={onNavigateToRegister} size="lg">
                      Register Your Organization
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {companies.map((company) => (
                    <Card
                      key={company.id}
                      className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-blue-500"
                      onClick={() => onSelectCompany(company)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                            <Building2 className="h-7 w-7" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="mb-1 truncate">{company.name}</h4>
                            <p className="text-sm text-muted-foreground truncate">{company.type}</p>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground mb-4">
                          <p className="truncate">📧 {company.email}</p>
                          <p className="truncate">📞 {company.phone}</p>
                          <p className="truncate">📍 {company.location}</p>
                        </div>
                        <Button className="w-full" variant="outline">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Access Portal
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Big Action Buttons at Bottom */}
            <div className="mt-20 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 border-blue-200 hover:border-blue-500 transition-all cursor-pointer hover:shadow-xl" onClick={onNavigateToRecorder}>
                  <CardContent className="p-8 text-center">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl mb-3">Quick Recorder</h3>
                    <p className="text-muted-foreground mb-6">
                      Need to quickly record data without setting up an organization? Use our Quick Recorder tool to create custom forms and generate PDF reports.
                    </p>
                    <Button size="lg" variant="outline" className="w-full">
                      <FileText className="h-5 w-5 mr-2" />
                      Start Recording
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 hover:border-purple-500 transition-all cursor-pointer hover:shadow-xl" onClick={onNavigateToRegister}>
                  <CardContent className="p-8 text-center">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                      <Plus className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl mb-3">Register Organization</h3>
                    <p className="text-muted-foreground mb-6">
                      Ready to manage your entire organization? Register now to access our full suite of management tools including member tracking, attendance, and more.
                    </p>
                    <Button size="lg" className="w-full">
                      <Plus className="h-5 w-5 mr-2" />
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {currentPage === 'about' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl mb-6">About Us</h2>
            <Card>
              <CardContent className="p-8 space-y-4">
                <p>
                  OrgManage is a comprehensive organizational management system designed to streamline 
                  operations for organizations of all sizes. Our platform provides powerful tools for 
                  managing members, tracking attendance, handling permissions, and maintaining discipline.
                </p>
                <p>
                  Built with modern technology and user experience in mind, we offer a secure, scalable, 
                  and intuitive solution that adapts to your organization's unique needs.
                </p>
                <h3 className="text-2xl mt-6 mb-4">Key Features</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Role-based access control (CEO, Committee, Discipline, Member)</li>
                  <li>Comprehensive attendance tracking and reporting</li>
                  <li>Case management and disciplinary tracking</li>
                  <li>Permission request and approval workflow</li>
                  <li>Announcement system with comments</li>
                  <li>Automated password generation and management</li>
                  <li>Multi-tenant architecture with data isolation</li>
                  <li>Downloadable reports and attendance sheets</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {currentPage === 'contact' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl mb-6 text-center">Contact Us</h2>
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl mb-2">Get in Touch</h3>
                    <p className="text-muted-foreground">
                      Have questions or need support? We're here to help!
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        📧
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p>support@orgmanage.com</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        📞
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p>+1 (555) 123-4567</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                        📍
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p>123 Business Ave, Suite 100<br />City, State 12345</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h4 className="mb-4">Business Hours</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monday - Friday:</span>
                        <span>9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Saturday:</span>
                        <span>10:00 AM - 4:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sunday:</span>
                        <span>Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Novilo. All rights reserved.</p>
            <p className="mt-2">Smart Management Made Easy</p>
          </div>
        </div>
      </footer>
    </div>
  );
}