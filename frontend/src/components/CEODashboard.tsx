import { useMemo, useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Breadcrumb } from './Breadcrumb';
import { SocialMediaLinks } from './SocialMediaLinks';
import { ViewPermissions } from './ViewPermissions';
import { CreateAnnouncement } from './CreateAnnouncement';
import { AnnouncementsList } from './AnnouncementsList';
import { MemberManagement } from './MemberManagement';
import { UserManagement } from './UserManagement';
import { Bell, CheckCircle, FileText, Gavel, LogOut, Megaphone, MessageSquare, ShieldCheck, XCircle, Users, UserCog } from 'lucide-react';
import type { Announcement, Case, Company, Comment, Member, PasswordChangeRequest, PermissionRequest, User } from '../App';
import { toast } from 'sonner';
import { getMembers, createMember, updateMember } from '../api';

interface CEODashboardProps {
  user: User;
  company: Company;
  onLogout: () => void;
  permissionRequests: PermissionRequest[];
  onUpdatePermission: (requestId: string, status: PermissionRequest['status']) => void;
  announcements: Announcement[];
  onPublishAnnouncement: (announcement: Omit<Announcement, 'id' | 'committeeId' | 'committeeName' | 'timestamp' | 'comments'>) => void;
  onAddAnnouncementComment: (announcementId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  cases: Case[];
  onCreateCase: (caseData: Omit<Case, 'id' | 'timestamp' | 'comments' | 'companyId'>) => void;
  onAddCaseComment: (caseId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  onDecideCase: (caseId: string, decision: 'suspended' | 'forgiven', decisionText?: string) => void;
  passwordChangeRequests: PasswordChangeRequest[];
}

export function CEODashboard({
  user,
  company,
  onLogout,
  permissionRequests,
  onUpdatePermission,
  announcements,
  onPublishAnnouncement,
  onAddAnnouncementComment,
  cases,
  onCreateCase,
  onAddCaseComment,
  onDecideCase,
  passwordChangeRequests,
}: CEODashboardProps) {
  const [currentTab, setCurrentTab] = useState('overview');
  const [members, setMembers] = useState<Member[]>([]);
  const [caseTitle, setCaseTitle] = useState('');
  const [caseMemberName, setCaseMemberName] = useState('');
  const [caseDescription, setCaseDescription] = useState('');
  const [caseDate, setCaseDate] = useState('');
  const myAnnouncements = useMemo(() => announcements.filter(a => a.committeeId === user.id), [announcements, user.id]);

  useEffect(() => {
    getMembers(company.id).then(setMembers).catch(() => {});
  }, [company.id]);

  const handleAddMember = (member: Omit<Member, 'id' | 'companyId'>) => {
    const payload = { ...member, companyId: company.id };
    createMember(payload)
      .then((m) => {
        setMembers((prev) => [...prev, m]);
        toast.success('Member added and saved to database');
      })
      .catch(() => toast.error('Failed to add member'));
  };

  const handleUpdateMember = (memberId: string, updates: Partial<Member>) => {
    updateMember(memberId, updates)
      .then((m) => {
        setMembers(prev => prev.map(x => x.id === m.id ? m : x));
        toast.success('Member updated');
      })
      .catch(() => toast.error('Failed to update member'));
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseTitle.trim() || !caseMemberName.trim() || !caseDescription.trim() || !caseDate.trim()) {
      toast.error('Fill in all case fields');
      return;
    }
    onCreateCase({
      reportedBy: user.id,
      reporterName: user.name,
      reporterRole: 'discipline',
      memberId: caseMemberName,
      memberName: caseMemberName,
      title: caseTitle.trim(),
      description: caseDescription.trim(),
      date: caseDate.trim(),
      status: 'pending',
    });
    setCaseTitle('');
    setCaseMemberName('');
    setCaseDescription('');
    setCaseDate('');
    toast.success('Case created');
  };

  const handleDecide = (c: Case, decision: 'suspended' | 'forgiven') => {
    const text = decision === 'suspended' ? 'Suspended by CEO' : 'Forgiven by CEO';
    onDecideCase(c.id, decision, text);
    toast.success(`Case ${decision}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl">CEO Portal</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <SocialMediaLinks />
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'CEO Portal' },
            {
              label:
                currentTab === 'overview'
                  ? 'Overview'
                  : currentTab === 'permissions'
                  ? 'Permission Requests'
                  : currentTab === 'cases'
                  ? 'Cases'
                  : currentTab === 'create'
                  ? 'Create Announcement'
                  : currentTab === 'announcements'
                  ? 'All Announcements'
                  : 'Password Changes',
              active: true,
            },
          ]}
        />

        <Tabs defaultValue="overview" value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full max-w-4xl grid-cols-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Permissions
            </TabsTrigger>
            <TabsTrigger value="cases" className="flex items-center gap-2">
              <Gavel className="h-4 w-4" />
              Cases
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Create
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Announcements
            </TabsTrigger>
            <TabsTrigger value="passwords" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Passwords
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{permissionRequests.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Gavel className="h-4 w-4 text-purple-600" />
                    Cases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{cases.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Bell className="h-4 w-4 text-orange-600" />
                    Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{announcements.length}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members" className="mt-6">
            <MemberManagement 
              company={company}
              members={members}
              onAddMember={handleAddMember}
              onUpdateMember={handleUpdateMember}
              onDeleteMember={handleDeleteMember}
            />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagement company={company} />
          </TabsContent>

          <TabsContent value="permissions" className="mt-6">
            <ViewPermissions requests={permissionRequests} onUpdateStatus={onUpdatePermission} />
          </TabsContent>

          <TabsContent value="cases" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Open Cases</CardTitle>
                  <CardDescription>Review and decide on reported cases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cases.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">No cases found.</div>
                    ) : (
                      cases.map((c) => (
                        <Card key={c.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant={c.status === 'pending' ? 'secondary' : c.status === 'suspended' ? 'destructive' : 'outline'}>
                                    {c.status}
                                  </Badge>
                                </div>
                                <h4 className="mb-1">{c.title}</h4>
                                <p className="text-sm text-muted-foreground mb-2">{c.description}</p>
                                <p className="text-xs text-muted-foreground mb-3">
                                  Reported by {c.reporterName} on {new Date(c.date).toLocaleDateString()}
                                </p>
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => handleDecide(c, 'suspended')} className="bg-red-600 hover:bg-red-700">
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Suspend
                                  </Button>
                                  <Button size="sm" onClick={() => handleDecide(c, 'forgiven')} className="bg-green-600 hover:bg-green-700">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Forgive
                                  </Button>
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
                  <CardTitle>Create Case</CardTitle>
                  <CardDescription>Create a new case for review</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateCase} className="space-y-4">
                    <Input placeholder="Member name or ID" value={caseMemberName} onChange={(e) => setCaseMemberName(e.target.value)} />
                    <Input placeholder="Case title" value={caseTitle} onChange={(e) => setCaseTitle(e.target.value)} />
                    <Textarea placeholder="Case description" value={caseDescription} onChange={(e) => setCaseDescription(e.target.value)} rows={5} />
                    <Input type="date" value={caseDate} onChange={(e) => setCaseDate(e.target.value)} />
                    <Button type="submit">Create Case</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="create" className="mt-6">
            <CreateAnnouncement onPublish={onPublishAnnouncement} publishedAnnouncements={myAnnouncements} />
          </TabsContent>

          <TabsContent value="announcements" className="mt-6">
            <AnnouncementsList announcements={announcements} />
          </TabsContent>

          <TabsContent value="passwords" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Password Change Requests</CardTitle>
                <CardDescription>Review pending password changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {passwordChangeRequests.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">No password change requests.</div>
                  ) : (
                    passwordChangeRequests.map((req) => (
                      <Card key={req.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={req.status === 'pending' ? 'secondary' : req.status === 'approved' ? 'default' : 'destructive'}>
                                  {req.status}
                                </Badge>
                              </div>
                              <h4 className="mb-1">{req.userName}</h4>
                              <p className="text-sm text-muted-foreground mb-2">Requested a password change</p>
                              <p className="text-xs text-muted-foreground">
                                Submitted on {new Date(req.timestamp).toLocaleDateString()} at {new Date(req.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
