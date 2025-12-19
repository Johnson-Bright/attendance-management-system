import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import { toast } from 'sonner';
import type { PermissionRequest } from '../App';

interface ViewPermissionsProps {
  requests: PermissionRequest[];
  onUpdateStatus: (requestId: string, status: PermissionRequest['status']) => void;
}

export function ViewPermissions({ requests, onUpdateStatus }: ViewPermissionsProps) {
  const [filterStatus, setFilterStatus] = useState<PermissionRequest['status'] | 'all'>('all');

  const filteredRequests = requests.filter(request => {
    if (filterStatus !== 'all' && request.status !== filterStatus) return false;
    return true;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getStatusIcon = (status: PermissionRequest['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: PermissionRequest['status']) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'pending':
        return 'secondary';
    }
  };

  const handleStatusChange = (requestId: string, newStatus: PermissionRequest['status']) => {
    onUpdateStatus(requestId, newStatus);
    toast.success(`Permission request ${newStatus}`);
  };

  const statusCounts = {
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{statusCounts.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{statusCounts.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{statusCounts.rejected}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Permission Requests</CardTitle>
              <CardDescription>Review and manage student permission requests</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{filteredRequests.length} requests</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as PermissionRequest['status'] | 'all')}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No permission requests found.
              </div>
            ) : (
              filteredRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                        {request.userName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p>{request.userName}</p>
                              <span className="text-sm text-muted-foreground">
                                requested permission for {new Date(request.date).toLocaleDateString()}
                              </span>
                            </div>
                            <Badge variant={getStatusVariant(request.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(request.status)}
                                {request.status}
                              </span>
                            </Badge>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm">{request.reason}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          Submitted on {new Date(request.timestamp).toLocaleDateString()} at {new Date(request.timestamp).toLocaleTimeString()}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(request.id, 'approved')}
                            disabled={request.status === 'approved'}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusChange(request.id, 'rejected')}
                            disabled={request.status === 'rejected'}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          {request.status !== 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(request.id, 'pending')}
                            >
                              Reset to Pending
                            </Button>
                          )}
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
