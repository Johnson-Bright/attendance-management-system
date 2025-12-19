import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { CalendarIcon, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { PermissionRequest as PermissionRequestType } from '../App';

interface PermissionRequestProps {
  onSubmit: (request: Omit<PermissionRequestType, 'id' | 'userId' | 'userName' | 'timestamp' | 'status'>) => void;
  userRequests: PermissionRequestType[];
}

export function PermissionRequest({ onSubmit, userRequests }: PermissionRequestProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !reason.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    onSubmit({
      date: date.toISOString().split('T')[0],
      reason: reason.trim(),
    });

    // Reset form
    setDate(undefined);
    setReason('');
    toast.success('Permission request sent to discipline!');
  };

  const getStatusIcon = (status: PermissionRequestType['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-600" />;
    }
  };

  const getStatusVariant = (status: PermissionRequestType['status']) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'pending':
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Request Permission</CardTitle>
          <CardDescription>
            Request permission if you cannot attend on a specific date
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Date of Absence *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? date.toLocaleDateString() : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Absence *</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a detailed reason for your absence..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={6}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Submit Permission Request
            </Button>
          </form>
        </CardContent>
      </Card>

      {userRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Permission Requests</CardTitle>
            <CardDescription>Track the status of your requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getStatusVariant(request.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(request.status)}
                              {request.status}
                            </span>
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(request.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{request.reason}</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted on {new Date(request.timestamp).toLocaleDateString()} at {new Date(request.timestamp).toLocaleTimeString()}
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
