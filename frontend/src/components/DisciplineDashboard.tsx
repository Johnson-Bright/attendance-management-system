import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { ClipboardList, History, LogOut, FileText, Bell } from 'lucide-react';
import { MarkAttendance } from './MarkAttendance';
import { ViewAttendance } from './ViewAttendance';
import { ViewPermissions } from './ViewPermissions';
import { AnnouncementsList } from './AnnouncementsList';
import { SocialMediaLinks } from './SocialMediaLinks';
import { Breadcrumb } from './Breadcrumb';
import type { User, Member, AttendanceRecord, PermissionRequest, Announcement, Company } from '../App';
import { getMembers, getAttendance, saveAttendance } from '../api';
import { toast } from 'sonner';

interface DisciplineDashboardProps {
  user: User;
  company: Company;
  onLogout: () => void;
  permissionRequests: PermissionRequest[];
  onUpdatePermission: (requestId: string, status: PermissionRequest['status']) => void;
  announcements: Announcement[];
}

 

 export function DisciplineDashboard({ user, company, onLogout, permissionRequests, onUpdatePermission, announcements }: DisciplineDashboardProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [currentTab, setCurrentTab] = useState('mark');
 
  useEffect(() => {
    const date = new Date().toISOString().split('T')[0];
    getMembers(company.id).then(setMembers).catch(() => {});
    getAttendance({ date }).then(setAttendanceRecords).catch(() => {});
  }, [company.id]);
 
  const handleSaveAttendance = (records: { memberId: string; status: 'present' | 'absent' }[]) => {
    const date = new Date().toISOString().split('T')[0];
    saveAttendance(records, date, user.name)
      .then((created) => {
        setAttendanceRecords((prev) => {
          const filtered = prev.filter(r => r.date !== date);
          return [...filtered, ...created];
        });
        toast.success(`Attendance saved to database for ${created.length} members`);
      })
      .catch((err) => {
        toast.error('Failed to save attendance. Please try again.');
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl">Discipline Portal</h1>
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
          { label: 'Discipline Portal' },
          { 
            label: currentTab === 'mark' ? 'Mark Attendance' : 
                   currentTab === 'view' ? 'View Records' : 
                   currentTab === 'permissions' ? 'Permission Requests' : 
                   'Announcements',
            active: true 
          }
        ]} />
        
        <Tabs defaultValue="mark" value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full max-w-3xl grid-cols-4">
            <TabsTrigger value="mark" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Mark Attendance
            </TabsTrigger>
            <TabsTrigger value="view" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              View Records
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Permissions
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Announcements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mark" className="mt-6">
            <MarkAttendance 
              members={members} 
              onSave={handleSaveAttendance}
              existingRecords={attendanceRecords}
            />
          </TabsContent>

          <TabsContent value="view" className="mt-6">
            <ViewAttendance 
              members={members} 
              attendanceRecords={attendanceRecords}
            />
          </TabsContent>

          <TabsContent value="permissions" className="mt-6">
            <ViewPermissions 
              requests={permissionRequests} 
              onUpdateStatus={onUpdatePermission}
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
