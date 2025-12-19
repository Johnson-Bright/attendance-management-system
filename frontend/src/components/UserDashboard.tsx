import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { MessageSquare, LogOut, FileText, Bell } from 'lucide-react';

import { SubmitIdeas } from './SubmitIdeas';
import { PermissionRequest as PermissionRequestComponent } from './PermissionRequest';
import { AnnouncementsList } from './AnnouncementsList';
import { SocialMediaLinks } from './SocialMediaLinks';
import { Breadcrumb } from './Breadcrumb';
import type { User, Idea, Announcement, PermissionRequest, Company } from '../App';

interface UserDashboardProps {
  user: User;
  company: Company;
  onLogout: () => void;
  announcements: Announcement[];
}



export function UserDashboard({ user, company, onLogout, announcements }: UserDashboardProps) {

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [permissionRequests, setPermissionRequests] = useState<PermissionRequest[]>([]);
  const [currentTab, setCurrentTab] = useState('ideas');



  const handleSubmitIdea = (idea: Omit<Idea, 'id' | 'userId' | 'userName' | 'timestamp' | 'status'>) => {
    const newIdea: Idea = {
      ...idea,
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    setIdeas(prev => [...prev, newIdea]);
  };

  const handleSubmitPermission = (permission: Omit<PermissionRequest, 'id' | 'userId' | 'userName' | 'timestamp' | 'status'>) => {
    const newPermission: PermissionRequest = {
      ...permission,
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    setPermissionRequests(prev => [...prev, newPermission]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl">Organisation Portal</h1>
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
          { label: 'User Portal' },
          { 
            label: currentTab === 'ideas' ? 'Submit Ideas' : 
                   currentTab === 'permission' ? 'Permission Request' : 
                   'Announcements',
            active: true 
          }
        ]} />
        
        <Tabs defaultValue="ideas" value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full max-w-3xl grid-cols-3">
            <TabsTrigger value="ideas" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Ideas
            </TabsTrigger>
            <TabsTrigger value="permission" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Permission
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Announcements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ideas" className="mt-6">
            <SubmitIdeas onSubmit={handleSubmitIdea} userIdeas={ideas} />
          </TabsContent>

          <TabsContent value="permission" className="mt-6">
            <PermissionRequestComponent onSubmit={handleSubmitPermission} userRequests={permissionRequests} />
          </TabsContent>

          <TabsContent value="announcements" className="mt-6">
            <AnnouncementsList announcements={announcements} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}