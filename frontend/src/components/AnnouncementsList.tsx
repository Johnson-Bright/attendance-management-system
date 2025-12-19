import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Bell, Megaphone, Calendar as CalendarIcon, GraduationCap, Filter } from 'lucide-react';
import type { Announcement } from '../App';

interface AnnouncementsListProps {
  announcements: Announcement[];
}

export function AnnouncementsList({ announcements }: AnnouncementsListProps) {
  const [filterCategory, setFilterCategory] = useState<Announcement['category'] | 'all'>('all');

  const filteredAnnouncements = announcements
    .filter(announcement => {
      if (filterCategory !== 'all' && announcement.category !== filterCategory) return false;
      return true;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getCategoryIcon = (category: Announcement['category']) => {
    switch (category) {
      case 'general':
        return <Bell className="h-4 w-4" />;
      case 'urgent':
        return <Megaphone className="h-4 w-4" />;
      case 'event':
        return <CalendarIcon className="h-4 w-4" />;
      case 'academic':
        return <GraduationCap className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: Announcement['category']) => {
    switch (category) {
      case 'general':
        return 'default';
      case 'urgent':
        return 'destructive';
      case 'event':
        return 'secondary';
      case 'academic':
        return 'outline';
    }
  };

  const categoryCounts = {
    general: announcements.filter(a => a.category === 'general').length,
    urgent: announcements.filter(a => a.category === 'urgent').length,
    event: announcements.filter(a => a.category === 'event').length,
    academic: announcements.filter(a => a.category === 'academic').length,
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bell className="h-4 w-4" />
              General
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{categoryCounts.general}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-red-600" />
              Urgent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{categoryCounts.urgent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{categoryCounts.event}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Academic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{categoryCounts.academic}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>Stay updated with the latest announcements</CardDescription>
            </div>
            <Badge variant="secondary">{filteredAnnouncements.length} announcements</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as Announcement['category'] | 'all')}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="event">Events</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredAnnouncements.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No announcements available.
              </div>
            ) : (
              filteredAnnouncements.map((announcement) => (
                <Card 
                  key={announcement.id}
                  className={announcement.category === 'urgent' ? 'border-red-200 bg-red-50' : ''}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        announcement.category === 'urgent' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                      }`}>
                        {getCategoryIcon(announcement.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <h3 className="mb-1">{announcement.title}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={getCategoryColor(announcement.category)}>
                                <span className="flex items-center gap-1">
                                  {getCategoryIcon(announcement.category)}
                                  {announcement.category}
                                </span>
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                by {announcement.committeeName}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                        <p className="text-xs text-muted-foreground">
                          Posted on {new Date(announcement.timestamp).toLocaleDateString()} at {new Date(announcement.timestamp).toLocaleTimeString()}
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
    </div>
  );
}
