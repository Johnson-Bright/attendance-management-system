import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { CompanyRegistration } from './components/CompanyRegistration';
import { QuickRecorder } from './components/QuickRecorder';
import { LoginPage } from './components/LoginPage';
import { DisciplineDashboard } from './components/DisciplineDashboard';
import { UserDashboard } from './components/UserDashboard';
import { CommitteeDashboard } from './components/CommitteeDashboard';
import { CEODashboard } from './components/CEODashboard';

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  description: string;
  location: string;
  createdAt: string;
}

export interface User {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: 'ceo' | 'discipline' | 'committee' | 'member';
  password?: string;
  suspended?: boolean;
}

export interface Member {
  id: string;
  companyId: string;
  name: string;
  registrationNumber: string;
  department: string;
  joinedYear: string;
  email?: string;
  suspended?: boolean;
  suspensionReason?: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName?: string;
  registrationNumber?: string;
  department?: string;
  date: string;
  status: 'present' | 'absent';
  markedBy: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
}

export interface Idea {
  id: string;
  userId: string;
  userName: string;
  category: 'suggestion' | 'complaint' | 'question' | 'feedback';
  title: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

export interface Announcement {
  id: string;
  committeeId: string;
  committeeName: string;
  title: string;
  content: string;
  category: 'general' | 'academic' | 'event' | 'urgent';
  timestamp: string;
  comments?: Comment[];
}

export interface PermissionRequest {
  id: string;
  userId: string;
  userName: string;
  reason: string;
  date: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Case {
  id: string;
  companyId: string;
  reportedBy: string;
  reporterName: string;
  reporterRole: 'committee' | 'discipline';
  memberId: string;
  memberName: string;
  title: string;
  description: string;
  date: string;
  timestamp: string;
  status: 'pending' | 'suspended' | 'forgiven';
  decision?: string;
  decidedBy?: string;
  decidedAt?: string;
  comments: Comment[];
}

export interface PasswordChangeRequest {
  id: string;
  userId: string;
  userName: string;
  newPassword: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

type AppPage = 'landing' | 'register' | 'recorder' | 'login';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: '1',
      name: 'Tech Innovation Hub',
      email: 'admin@techhub.com',
      phone: '+1 (555) 123-4567',
      type: 'Technology Organization',
      description: 'A community of tech enthusiasts and innovators',
      location: 'San Francisco, CA',
      createdAt: '2024-01-15T10:00:00',
    }
  ]);

  const [permissionRequests, setPermissionRequests] = useState<PermissionRequest[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      committeeId: '2',
      committeeName: 'Jane Committee',
      title: 'Welcome to New Semester',
      content: 'We are excited to welcome everyone to the new academic semester.',
      category: 'general',
      timestamp: '2024-11-10T09:00:00',
      comments: [],
    },
  ]);
  const [cases, setCases] = useState<Case[]>([]);
  const [passwordChangeRequests, setPasswordChangeRequests] = useState<PasswordChangeRequest[]>([]);

  const handleSelectCompany = (company: Company) => {
    setCurrentCompany(company);
    setCurrentPage('login');
  };

  const handleRegisterCompany = (company: Omit<Company, 'id' | 'createdAt'>) => {
    const newCompany: Company = {
      ...company,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setCompanies(prev => [...prev, newCompany]);
    setCurrentCompany(newCompany);
    setCurrentPage('login');
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleBackToCompanies = () => {
    setCurrentCompany(null);
    setCurrentUser(null);
    setCurrentPage('landing');
    setAnnouncements([]);
    setPermissionRequests([]);
  };

  const handleUpdatePermission = (requestId: string, status: PermissionRequest['status']) => {
    setPermissionRequests(prev =>
      prev.map(req => req.id === requestId ? { ...req, status } : req)
    );
  };

  const handlePublishAnnouncement = (announcement: Omit<Announcement, 'id' | 'committeeId' | 'committeeName' | 'timestamp' | 'comments'>) => {
    if (!currentUser) return;
    
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString(),
      committeeId: currentUser.id,
      committeeName: currentUser.name,
      timestamp: new Date().toISOString(),
      comments: [],
    };

    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  const handleAddAnnouncementComment = (announcementId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    setAnnouncements(prev =>
      prev.map(ann =>
        ann.id === announcementId
          ? { ...ann, comments: [...(ann.comments || []), newComment] }
          : ann
      )
    );
  };

  const handleCreateCase = (caseData: Omit<Case, 'id' | 'timestamp' | 'comments' | 'companyId'>) => {
    if (!currentCompany) return;

    const newCase: Case = {
      ...caseData,
      id: Date.now().toString(),
      companyId: currentCompany.id,
      timestamp: new Date().toISOString(),
      comments: [],
    };

    setCases(prev => [newCase, ...prev]);
  };

  const handleAddCaseComment = (caseId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    setCases(prev =>
      prev.map(c =>
        c.id === caseId
          ? { ...c, comments: [...c.comments, newComment] }
          : c
      )
    );
  };

  const handleDecideCase = (caseId: string, decision: 'suspended' | 'forgiven', decisionText?: string) => {
    if (!currentUser || currentUser.role !== 'ceo') return;

    setCases(prev =>
      prev.map(c =>
        c.id === caseId
          ? {
              ...c,
              status: decision,
              decision: decisionText,
              decidedBy: currentUser.name,
              decidedAt: new Date().toISOString(),
            }
          : c
      )
    );

    // If suspended, create an announcement
    if (decision === 'suspended') {
      const caseData = cases.find(c => c.id === caseId);
      if (caseData) {
        const suspensionAnnouncement: Announcement = {
          id: Date.now().toString(),
          committeeId: currentUser.id,
          committeeName: 'System',
          title: `Member Suspended: ${caseData.memberName}`,
          content: `${caseData.memberName} has been suspended. Case: ${caseData.title}. ${decisionText || ''}`,
          category: 'urgent',
          timestamp: new Date().toISOString(),
          comments: [],
        };
        setAnnouncements(prev => [suspensionAnnouncement, ...prev]);
      }
    }
  };

  // Show landing page
  if (currentPage === 'landing') {
    return (
      <LandingPage
        companies={companies}
        onSelectCompany={handleSelectCompany}
        onNavigateToRegister={() => setCurrentPage('register')}
        onNavigateToRecorder={() => setCurrentPage('recorder')}
      />
    );
  }

  // Show company registration
  if (currentPage === 'register') {
    return (
      <CompanyRegistration
        onRegister={handleRegisterCompany}
        onBack={() => setCurrentPage('landing')}
      />
    );
  }

  // Show quick recorder
  if (currentPage === 'recorder') {
    return <QuickRecorder onBack={() => setCurrentPage('landing')} />;
  }

  // Show login page if no user logged in
  if (!currentUser && currentCompany) {
    return (
      <LoginPage 
        onLogin={handleLogin} 
        company={currentCompany}
        onBackToCompanies={handleBackToCompanies}
      />
    );
  }

  // Show dashboards based on role
  if (currentUser && currentCompany) {
    const companyCases = cases.filter(c => c.companyId === currentCompany.id);

    if (currentUser.role === 'ceo') {
      return (
        <CEODashboard
          user={currentUser}
          company={currentCompany}
          onLogout={handleLogout}
          permissionRequests={permissionRequests}
          onUpdatePermission={handleUpdatePermission}
          announcements={announcements}
          onPublishAnnouncement={handlePublishAnnouncement}
          onAddAnnouncementComment={handleAddAnnouncementComment}
          cases={companyCases}
          onCreateCase={handleCreateCase}
          onAddCaseComment={handleAddCaseComment}
          onDecideCase={handleDecideCase}
          passwordChangeRequests={passwordChangeRequests}
        />
      );
    }

    if (currentUser.role === 'discipline') {
      return (
        <DisciplineDashboard 
          user={currentUser} 
          company={currentCompany}
          onLogout={handleLogout}
          permissionRequests={permissionRequests}
          onUpdatePermission={handleUpdatePermission}
          announcements={announcements}
          onPublishAnnouncement={handlePublishAnnouncement}
          onAddAnnouncementComment={handleAddAnnouncementComment}
          cases={companyCases}
          onCreateCase={handleCreateCase}
        />
      );
    }

    if (currentUser.role === 'committee') {
      return (
        <CommitteeDashboard 
          user={currentUser}
          company={currentCompany}
          onLogout={handleLogout}
          announcements={announcements}
          onPublishAnnouncement={handlePublishAnnouncement}
          onAddAnnouncementComment={handleAddAnnouncementComment}
          cases={companyCases}
          onCreateCase={handleCreateCase}
          onAddCaseComment={handleAddCaseComment}
        />
      );
    }

    return (
      <UserDashboard 
        user={currentUser}
        company={currentCompany}
        onLogout={handleLogout} 
        announcements={announcements}
        onAddAnnouncementComment={handleAddAnnouncementComment}
        permissionRequests={permissionRequests.filter(p => p.userId === currentUser.id)}
      />
    );
  }

  return null;
}
