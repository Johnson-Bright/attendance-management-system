import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Send, Bell, Megaphone, Calendar, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import type { Announcement } from '../App';

interface CreateAnnouncementProps {
  onPublish: (announcement: Omit<Announcement, 'id' | 'committeeId' | 'committeeName' | 'timestamp'>) => void;
  publishedAnnouncements: Announcement[];
}

export function CreateAnnouncement({ onPublish, publishedAnnouncements }: CreateAnnouncementProps) {
  const [category, setCategory] = useState<Announcement['category'] | ''>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !title.trim() || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    onPublish({
      category: category as Announcement['category'],
      title: title.trim(),
      content: content.trim(),
    });

    // Reset form
    setCategory('');
    setTitle('');
    setContent('');
    toast.success('Announcement published successfully!');
  };

  const getCategoryIcon = (cat: Announcement['category']) => {
    switch (cat) {
      case 'general':
        return <Bell className="h-4 w-4" />;
      case 'urgent':
        return <Megaphone className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'academic':
        return <GraduationCap className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (cat: Announcement['category']) => {
    switch (cat) {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Announcement</CardTitle>
          <CardDescription>
            Publish announcements to notify all users in the organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Announcement Category *</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as Announcement['category'])}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>General - Regular announcements</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <div className="flex items-center gap-2">
                      <Megaphone className="h-4 w-4" />
                      <span>Urgent - Important notices</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="event">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Event - Upcoming events</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="academic">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>Academic - Educational updates</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter announcement title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Write your announcement details..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Publish Announcement
            </Button>
          </form>
        </CardContent>
      </Card>

      {publishedAnnouncements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Published Announcements</CardTitle>
            <CardDescription>Announcements you've created</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {publishedAnnouncements.slice(0, 5).map((announcement) => (
                <Card key={announcement.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getCategoryColor(announcement.category)}>
                            <span className="flex items-center gap-1">
                              {getCategoryIcon(announcement.category)}
                              {announcement.category}
                            </span>
                          </Badge>
                        </div>
                        <h4 className="mb-1">{announcement.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                        <p className="text-xs text-muted-foreground">
                          Published on {new Date(announcement.timestamp).toLocaleDateString()} at {new Date(announcement.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
