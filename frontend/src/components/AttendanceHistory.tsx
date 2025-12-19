import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useState } from 'react';
import type { Employee, AttendanceRecord } from '../App';

interface AttendanceHistoryProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
}

export function AttendanceHistory({ employees, attendanceRecords }: AttendanceHistoryProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');

  const dateStr = selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0];
  
  let filteredRecords = attendanceRecords.filter(r => r.date === dateStr);
  if (selectedEmployee !== 'all') {
    filteredRecords = filteredRecords.filter(r => r.employeeId === selectedEmployee);
  }

  // Get employee's recent attendance
  const employeeHistory = selectedEmployee !== 'all' 
    ? attendanceRecords
        .filter(r => r.employeeId === selectedEmployee)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10)
    : [];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>Choose a date to view attendance records</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filter by Employee</CardTitle>
            <CardDescription>View specific employee's attendance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedEmployee !== 'all' && employeeHistory.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2">Recent Attendance</h3>
                <div className="space-y-2">
                  {employeeHistory.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{new Date(record.date).toLocaleDateString()}</span>
                      <Badge variant={
                        record.status === 'present' ? 'default' :
                        record.status === 'late' ? 'secondary' :
                        record.status === 'half-day' ? 'outline' :
                        'destructive'
                      }>
                        {record.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records - {selectedDate?.toLocaleDateString()}</CardTitle>
          <CardDescription>
            {filteredRecords.length} record(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
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
                  const employee = employees.find(e => e.id === record.employeeId);
                  if (!employee) return null;

                  return (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span>{employee.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{record.checkIn ? record.checkIn.substring(0, 5) : '-'}</TableCell>
                      <TableCell>{record.checkOut ? record.checkOut.substring(0, 5) : '-'}</TableCell>
                      <TableCell>
                        <Badge variant={
                          record.status === 'present' ? 'default' :
                          record.status === 'late' ? 'secondary' :
                          record.status === 'half-day' ? 'outline' :
                          'destructive'
                        }>
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
