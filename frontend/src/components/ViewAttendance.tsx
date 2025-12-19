import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { CalendarIcon, Search, TrendingUp } from 'lucide-react';
import type { Member, AttendanceRecord } from '../App';

interface ViewAttendanceProps {
  members: Member[];
  attendanceRecords: AttendanceRecord[];
}

export function ViewAttendance({ members, attendanceRecords }: ViewAttendanceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'date' | 'member'>('date');

  const dateStr = selectedDate?.toISOString().split('T')[0] || '';

  // Filter by date
  const getRecordsByDate = () => {
    return attendanceRecords.filter(r => r.date === dateStr);
  };

  // Filter by member
  const getRecordsByMember = (memberId: string) => {
    return attendanceRecords
      .filter(r => r.memberId === memberId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filteredRecords = viewMode === 'date' 
    ? getRecordsByDate()
    : selectedMember === 'all' 
      ? attendanceRecords 
      : getRecordsByMember(selectedMember);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMemberById = (id: string) => members.find(m => m.id === id);

  // Calculate statistics for a member
  const getMemberStats = (memberId: string) => {
    const memberRecords = attendanceRecords.filter(r => r.memberId === memberId);
    const totalDays = memberRecords.length;
    const presentDays = memberRecords.filter(r => r.status === 'present').length;
    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
    return { totalDays, presentDays, attendanceRate };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>View and analyze attendance data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label>View Mode</Label>
                <Select value={viewMode} onValueChange={(v) => setViewMode(v as 'date' | 'member')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">By Date</SelectItem>
                    <SelectItem value="member">By Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {viewMode === 'date' ? (
                <div className="flex-1">
                  <Label>Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? selectedDate.toLocaleDateString() : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <div className="flex-1">
                  <Label>Select Member</Label>
                  <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Members</SelectItem>
                      {members.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.registrationNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {viewMode === 'date' ? (
              <div>
                <div className="mb-4 p-4 bg-muted rounded-lg">
                  <h3 className="mb-2">Summary for {selectedDate?.toLocaleDateString()}</h3>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total:</span> <span>{filteredRecords.length}</span>
                    </div>
                    <div className="text-green-600">
                      <span className="text-muted-foreground">Present:</span>{' '}
                      <span>{filteredRecords.filter(r => r.status === 'present').length}</span>
                    </div>
                    <div className="text-red-600">
                      <span className="text-muted-foreground">Absent:</span>{' '}
                      <span>{filteredRecords.filter(r => r.status === 'absent').length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Attendance Rate:</span>{' '}
                      <span>
                        {filteredRecords.length > 0
                          ? ((filteredRecords.filter(r => r.status === 'present').length / filteredRecords.length) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member Name</TableHead>
                      <TableHead>Registration Number</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Marked By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No attendance records found for this date
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecords.map((record) => {
                        const member = getMemberById(record.memberId);
                        return (
                          <TableRow key={record.id}>
                            <TableCell>{member?.name || 'Unknown'}</TableCell>
                            <TableCell>{member?.registrationNumber || '-'}</TableCell>
                            <TableCell>{member?.department || '-'}</TableCell>
                            <TableCell>
                              <Badge variant={record.status === 'present' ? 'default' : 'destructive'}>
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{record.markedBy}</TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div>
                {selectedMember !== 'all' && (() => {
                  const stats = getMemberStats(selectedMember);
                  const member = getMemberById(selectedMember);
                  return (
                    <div className="mb-4 p-4 bg-muted rounded-lg">
                      <h3 className="mb-2">{member?.name}'s Attendance Summary</h3>
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Days:</span> <span>{stats.totalDays}</span>
                        </div>
                        <div className="text-green-600">
                          <span className="text-muted-foreground">Present:</span> <span>{stats.presentDays}</span>
                        </div>
                        <div className="text-red-600">
                          <span className="text-muted-foreground">Absent:</span>{' '}
                          <span>{stats.totalDays - stats.presentDays}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-muted-foreground">Rate:</span>{' '}
                          <span>{stats.attendanceRate.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <Table>
                  <TableHeader>
                    <TableRow>
                      {selectedMember === 'all' && <TableHead>Member Name</TableHead>}
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Marked By</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={selectedMember === 'all' ? 5 : 4} className="text-center text-muted-foreground">
                          No attendance records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecords.map((record) => {
                        const member = getMemberById(record.memberId);
                        return (
                          <TableRow key={record.id}>
                            {selectedMember === 'all' && (
                              <TableCell>{member?.name || 'Unknown'}</TableCell>
                            )}
                            <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant={record.status === 'present' ? 'default' : 'destructive'}>
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{record.markedBy}</TableCell>
                            <TableCell>{new Date(record.timestamp).toLocaleTimeString()}</TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overall Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 mb-4"
            />
          </div>

          <div className="space-y-3">
            {filteredMembers.map((member) => {
              const stats = getMemberStats(member.id);
              return (
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
                          <p className="text-sm text-muted-foreground">{member.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl mb-1">{stats.attendanceRate.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">
                          {stats.presentDays} / {stats.totalDays} days
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
