import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Save, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Member, AttendanceRecord } from '../App';

interface MarkAttendanceProps {
  members: Member[];
  onSave: (records: { memberId: string; status: 'present' | 'absent' }[]) => void;
  existingRecords: AttendanceRecord[];
}

export function MarkAttendance({ members, onSave, existingRecords }: MarkAttendanceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>({});
  const today = new Date().toISOString().split('T')[0];

  // Load today's existing records
  useEffect(() => {
    const todayRecords = existingRecords.filter(r => r.date === today);
    const attendanceMap: Record<string, 'present' | 'absent'> = {};
    todayRecords.forEach(record => {
      attendanceMap[record.memberId] = record.status;
    });
    setAttendance(attendanceMap);
  }, [existingRecords, today]);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMark = (memberId: string, status: 'present' | 'absent') => {
    setAttendance(prev => ({ ...prev, [memberId]: status }));
  };

  const handleSave = () => {
    const records = Object.entries(attendance).map(([memberId, status]) => ({
      memberId,
      status,
    }));

    if (records.length === 0) {
      toast.error('Please mark at least one member before saving');
      return;
    }

    onSave(records);
    toast.success(`Attendance saved for ${records.length} members`);
  };

  const markedCount = Object.keys(attendance).length;
  const presentCount = Object.values(attendance).filter(s => s === 'present').length;
  const absentCount = Object.values(attendance).filter(s => s === 'absent').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mark Attendance</CardTitle>
            <CardDescription>
              Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </CardDescription>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Attendance
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members by name, registration number, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total:</span> <span>{members.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Marked:</span> <span>{markedCount}</span>
            </div>
            <div className="text-green-600">
              <span className="text-muted-foreground">Present:</span> <span>{presentCount}</span>
            </div>
            <div className="text-red-600">
              <span className="text-muted-foreground">Absent:</span> <span>{absentCount}</span>
            </div>
          </div>

          <div className="space-y-3">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No members found matching your search.
              </div>
            ) : (
              filteredMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p>{member.name}</p>
                            <Badge variant="outline">{member.registrationNumber}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {member.department} • Joined {member.joinedYear}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={attendance[member.id] === 'present' ? 'default' : 'outline'}
                          onClick={() => handleMark(member.id, 'present')}
                          className={attendance[member.id] === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant={attendance[member.id] === 'absent' ? 'destructive' : 'outline'}
                          onClick={() => handleMark(member.id, 'absent')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Absent
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
