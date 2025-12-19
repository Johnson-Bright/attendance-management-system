import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Lightbulb, MessageSquareWarning, HelpCircle, ThumbsUp, Filter } from 'lucide-react';
import { toast } from 'sonner';
import type { Idea } from '../App';

interface ViewIdeasProps {
  ideas: Idea[];
  onUpdateStatus: (ideaId: string, status: Idea['status']) => void;
}

export function ViewIdeas({ ideas, onUpdateStatus }: ViewIdeasProps) {
  const [filterCategory, setFilterCategory] = useState<Idea['category'] | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<Idea['status'] | 'all'>('all');

  const filteredIdeas = ideas.filter(idea => {
    if (filterCategory !== 'all' && idea.category !== filterCategory) return false;
    if (filterStatus !== 'all' && idea.status !== filterStatus) return false;
    return true;
  });

  const getCategoryIcon = (cat: Idea['category']) => {
    switch (cat) {
      case 'suggestion':
        return <Lightbulb className="h-4 w-4" />;
      case 'complaint':
        return <MessageSquareWarning className="h-4 w-4" />;
      case 'question':
        return <HelpCircle className="h-4 w-4" />;
      case 'feedback':
        return <ThumbsUp className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (cat: Idea['category']) => {
    switch (cat) {
      case 'suggestion':
        return 'default';
      case 'complaint':
        return 'destructive';
      case 'question':
        return 'secondary';
      case 'feedback':
        return 'outline';
    }
  };

  const handleStatusChange = (ideaId: string, newStatus: Idea['status']) => {
    onUpdateStatus(ideaId, newStatus);
    toast.success('Status updated successfully');
  };

  const categoryCounts = {
    suggestion: ideas.filter(i => i.category === 'suggestion').length,
    complaint: ideas.filter(i => i.category === 'complaint').length,
    question: ideas.filter(i => i.category === 'question').length,
    feedback: ideas.filter(i => i.category === 'feedback').length,
  };

  const statusCounts = {
    pending: ideas.filter(i => i.status === 'pending').length,
    reviewed: ideas.filter(i => i.status === 'reviewed').length,
    resolved: ideas.filter(i => i.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{categoryCounts.suggestion}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquareWarning className="h-4 w-4" />
              Complaints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{categoryCounts.complaint}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{categoryCounts.question}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <ThumbsUp className="h-4 w-4" />
              Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{categoryCounts.feedback}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Submitted Ideas & Messages</CardTitle>
              <CardDescription>Review and manage user submissions</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{statusCounts.pending} Pending</Badge>
              <Badge variant="secondary">{statusCounts.reviewed} Reviewed</Badge>
              <Badge variant="default">{statusCounts.resolved} Resolved</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as Idea['category'] | 'all')}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="suggestion">Suggestions</SelectItem>
                  <SelectItem value="complaint">Complaints</SelectItem>
                  <SelectItem value="question">Questions</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as Idea['status'] | 'all')}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredIdeas.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No ideas found matching your filters.
              </div>
            ) : (
              filteredIdeas.map((idea) => (
                <Card key={idea.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                        {idea.userName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p>{idea.userName}</p>
                              <span className="text-sm text-muted-foreground">
                                {new Date(idea.timestamp).toLocaleDateString()} at {new Date(idea.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={getCategoryColor(idea.category)}>
                                <span className="flex items-center gap-1">
                                  {getCategoryIcon(idea.category)}
                                  {idea.category}
                                </span>
                              </Badge>
                              <Badge variant={
                                idea.status === 'resolved' ? 'default' :
                                idea.status === 'reviewed' ? 'secondary' :
                                'outline'
                              }>
                                {idea.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <h4 className="mb-2">{idea.title}</h4>
                        <p className="text-sm text-muted-foreground mb-4">{idea.description}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(idea.id, 'pending')}
                            disabled={idea.status === 'pending'}
                          >
                            Mark as Pending
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleStatusChange(idea.id, 'reviewed')}
                            disabled={idea.status === 'reviewed'}
                          >
                            Mark as Reviewed
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(idea.id, 'resolved')}
                            disabled={idea.status === 'resolved'}
                          >
                            Mark as Resolved
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
    </div>
  );
}
