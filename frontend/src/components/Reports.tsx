import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { LogIn, LogOut, Search } from 'lucide-react';
import { useState } from 'react';
import type { Employee, AttendanceRecord } from '../App';

interface ReportsProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  onCheckIn: (employeeId: string) => void;
  onCheckOut: (employeeId: string) => void;
}

export function Reports({ employees, attendanceRecords, onCheckIn, onCheckOut }: ReportsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const getTodayRecord = (employeeId: string) => {
    return attendanceRecords.find(r => r.employeeId === employeeId && r.date === today);
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>Check in and check out employees for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search employees..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredEmployees.map((employee) => {
              const record = getTodayRecord(employee.id);
              const hasCheckedIn = record?.checkIn !== null && record?.checkIn !== undefined;
              const hasCheckedOut = record?.checkOut !== null && record?.checkOut !== undefined;

              return (
                <Card key={employee.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <p>{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.department} • {employee.position}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {record && (
                          <div className="flex items-center gap-3 text-sm">
                            {record.checkIn && (
                              <div>
                                <span className="text-muted-foreground">In: </span>
                                <span>{record.checkIn.substring(0, 5)}</span>
                              </div>
                            )}
                            {record.checkOut && (
                              <div>
                                <span className="text-muted-foreground">Out: </span>
                                <span>{record.checkOut.substring(0, 5)}</span>
                              </div>
                            )}
                            {record.status && (
                              <Badge variant={
                                record.status === 'present' ? 'default' :
                                record.status === 'late' ? 'secondary' :
                                record.status === 'half-day' ? 'outline' :
                                'destructive'
                              }>
                                {record.status}
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => onCheckIn(employee.id)}
                            disabled={hasCheckedIn}
                            variant={hasCheckedIn ? 'outline' : 'default'}
                          >
                            <LogIn className="h-4 w-4 mr-1" />
                            {hasCheckedIn ? 'Checked In' : 'Check In'}
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => onCheckOut(employee.id)}
                            disabled={!hasCheckedIn || hasCheckedOut}
                            variant={hasCheckedOut ? 'outline' : 'default'}
                          >
                            <LogOut className="h-4 w-4 mr-1" />
                            {hasCheckedOut ? 'Checked Out' : 'Check Out'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No employees found matching your search.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
