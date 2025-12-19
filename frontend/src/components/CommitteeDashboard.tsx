import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { MessageSquare, ClipboardList, LogOut, Megaphone, Bell, Users, FileText } from 'lucide-react';
import { ViewIdeas } from './ViewIdeas';
import { ViewAttendance } from './ViewAttendance';
import { CreateAnnouncement } from './CreateAnnouncement';
import { AnnouncementsList } from './AnnouncementsList';
import { MemberManagement } from './MemberManagement';
import { SocialMediaLinks } from './SocialMediaLinks';
import { Breadcrumb } from './Breadcrumb';
import type { User, Member, AttendanceRecord, Idea, Announcement, Company, PermissionRequest } from '../App';
import { CreateUser } from './CreateUser';
import { ViewPermissions } from './ViewPermissions';
import { getMembers, getAttendance, createMember, updateMember, getPermissions, updatePermission } from '../api';
import { toast } from 'sonner';

interface CommitteeDashboardProps {
  user: User;
  company: Company;
  onLogout: () => void;
  announcements: Announcement[];
  onPublishAnnouncement: (announcement: Omit<Announcement, 'id' | 'committeeId' | 'committeeName' | 'timestamp'>) => void;
}

// Members and attendance now come from the backend

// Mock ideas
const mockIdeas: Idea[] = [
  {
    id: '1',
    userId: '3',
    userName: 'Mike Student',
    category: 'suggestion',
    title: 'Improve Library Hours',
    description: 'I suggest extending the library hours to 10 PM on weekdays to accommodate students who study late.',
    timestamp: '2024-11-10T14:30:00',
    status: 'pending',
  },
  {
    id: '2',
    userId: '4',
    userName: 'Sarah Lee',
    category: 'complaint',
    title: 'Cafeteria Food Quality',
    description: 'The food quality in the cafeteria has been declining. Many students are experiencing stomach issues.',
    timestamp: '2024-11-12T09:15:00',
    status: 'reviewed',
  },
  {
    id: '3',
    userId: '5',
    userName: 'John Doe',
    category: 'question',
    title: 'Scholarship Information',
    description: 'Can you provide more information about the merit-based scholarships available for next semester?',
    timestamp: '2024-11-14T16:45:00',
    status: 'pending',
  },
  {
    id: '4',
    userId: '6',
    userName: 'Emma Wilson',
    category: 'feedback',
    title: 'Great Workshop',
    description: 'The recent technical workshop was excellent! Would love to see more such events in the future.',
    timestamp: '2024-11-15T11:20:00',
    status: 'resolved',
  },
];

export function CommitteeDashboard({ user, company, onLogout, announcements, onPublishAnnouncement }: CommitteeDashboardProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [permissions, setPermissions] = useState<PermissionRequest[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>(mockIdeas);
  const [currentTab, setCurrentTab] = useState('members');

  useEffect(() => {
    getMembers(company.id).then(setMembers).catch(() => {});
    getAttendance().then(setAttendanceRecords).catch(() => {});
    getPermissions().then(setPermissions).catch(() => {});
  }, [company.id]);

  const handleUpdateIdeaStatus = (ideaId: string, status: Idea['status']) => {
    setIdeas(prev =>
      prev.map(idea =>
        idea.id === ideaId ? { ...idea, status } : idea
      )
    );
  };

  const myAnnouncements = announcements.filter(a => a.committeeId === user.id);

  const handlePublishAnnouncement = (announcement: Omit<Announcement, 'id' | 'committeeId' | 'committeeName' | 'timestamp'>) => {
    onPublishAnnouncement(announcement);
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl">Committee Portal</h1>
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
        <Breadcrumb items={[
          { label: 'Committee Portal' },
          { 
            label: currentTab === 'ideas' ? 'View Ideas' : 
                   currentTab === 'attendance' ? 'View Attendance' : 
                   currentTab === 'members' ? 'Manage Members' :
                   currentTab === 'permissions' ? 'View Permissions' :
                   currentTab === 'users' ? 'Create Users' :
                   currentTab === 'create' ? 'Create Announcement' : 
                   'All Announcements',
            active: true 
          }
        ]} />
        
        <Tabs defaultValue="members" value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full max-w-6xl grid-cols-7">
            <TabsTrigger value="ideas" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Ideas
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Permissions
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Create
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              View All
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ideas" className="mt-6">
            <ViewIdeas ideas={ideas} onUpdateStatus={handleUpdateIdeaStatus} />
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            <ViewAttendance members={members} attendanceRecords={attendanceRecords} />
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
          
          <TabsContent value="permissions" className="mt-6">
            <ViewPermissions 
              requests={permissions}
              onUpdateStatus={(id, status) => {
                updatePermission(id, status)
                  .then((p) => {
                    setPermissions(prev => prev.map(x => x.id === p.id ? p : x));
                    toast.success('Permission updated');
                  })
                  .catch(() => toast.error('Failed to update permission'));
              }}
            />
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <CreateUser company={company} />
          </TabsContent>

          <TabsContent value="create" className="mt-6">
            <CreateAnnouncement 
              onPublish={handlePublishAnnouncement} 
              publishedAnnouncements={myAnnouncements}
            />
          </TabsContent>

          <TabsContent value="announcements" className="mt-6">
            <AnnouncementsList announcements={announcements} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
