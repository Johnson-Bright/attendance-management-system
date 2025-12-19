import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Send, Lightbulb, MessageSquareWarning, HelpCircle, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';
import type { Idea } from '../App';

interface SubmitIdeasProps {
  onSubmit: (idea: Omit<Idea, 'id' | 'userId' | 'userName' | 'timestamp' | 'status'>) => void;
  userIdeas: Idea[];
}

export function SubmitIdeas({ onSubmit, userIdeas }: SubmitIdeasProps) {
  const [category, setCategory] = useState<Idea['category'] | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !title.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    onSubmit({
      category: category as Idea['category'],
      title: title.trim(),
      description: description.trim(),
    });

    // Reset form
    setCategory('');
    setTitle('');
    setDescription('');
    toast.success('Your message has been sent to the committee!');
  };

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Submit Ideas & Feedback</CardTitle>
          <CardDescription>
            Share your suggestions, questions, complaints, or feedback with the committee
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Message Type *</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as Idea['category'])}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select message type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="suggestion">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      <span>Suggestion - Share your ideas</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="complaint">
                    <div className="flex items-center gap-2">
                      <MessageSquareWarning className="h-4 w-4" />
                      <span>Complaint - Report an issue</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="question">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      <span>Question - Ask for information</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="feedback">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Feedback - General comments</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Brief summary of your message"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about your suggestion, complaint, question, or feedback..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Submit to Committee
            </Button>
          </form>
        </CardContent>
      </Card>

      {userIdeas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Submissions</CardTitle>
            <CardDescription>Messages you've sent to the committee</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userIdeas.map((idea) => (
                <Card key={idea.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
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
                        <h4 className="mb-1">{idea.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{idea.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted on {new Date(idea.timestamp).toLocaleDateString()} at {new Date(idea.timestamp).toLocaleTimeString()}
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
