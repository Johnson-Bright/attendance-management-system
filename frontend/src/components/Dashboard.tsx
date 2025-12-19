import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Users, CheckCircle2, XCircle, Clock, TrendingUp } from 'lucide-react';
import type { Employee, AttendanceRecord } from '../App';

interface DashboardProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
}

export function Dashboard({ employees, attendanceRecords }: DashboardProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = attendanceRecords.filter(r => r.date === today);

  const presentCount = todayRecords.filter(r => r.status === 'present' || r.status === 'late').length;
  const absentCount = todayRecords.filter(r => r.status === 'absent').length;
  const lateCount = todayRecords.filter(r => r.status === 'late').length;
  const totalEmployees = employees.length;

  const attendanceRate = totalEmployees > 0 ? ((presentCount / totalEmployees) * 100).toFixed(1) : '0';

  // Calculate this week's average
  const weekRecords = attendanceRecords.filter(r => {
    const recordDate = new Date(r.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return recordDate >= weekAgo;
  });
  const weekPresent = weekRecords.filter(r => r.status === 'present' || r.status === 'late').length;
  const weekAverage = weekRecords.length > 0 ? ((weekPresent / weekRecords.length) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Active workforce
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Present Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{presentCount}</div>
            <p className="text-xs text-muted-foreground">
              {attendanceRate}% attendance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Absent Today</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{absentCount}</div>
            <p className="text-xs text-muted-foreground">
              Not checked in
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Late Arrivals</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{lateCount}</div>
            <p className="text-xs text-muted-foreground">
              After 9:15 AM
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
          <CardDescription>Overview of employees checked in today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayRecords.length === 0 ? (
              <p className="text-muted-foreground">No attendance records for today yet.</p>
            ) : (
              todayRecords.slice(0, 8).map((record) => {
                const employee = employees.find(e => e.id === record.employeeId);
                if (!employee) return null;

                return (
                  <div key={record.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p>{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {record.checkIn && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">In: </span>
                          <span>{record.checkIn.substring(0, 5)}</span>
                        </div>
                      )}
                      {record.checkOut && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Out: </span>
                          <span>{record.checkOut.substring(0, 5)}</span>
                        </div>
                      )}
                      <Badge variant={
                        record.status === 'present' ? 'default' :
                        record.status === 'late' ? 'secondary' :
                        record.status === 'half-day' ? 'outline' :
                        'destructive'
                      }>
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Weekly Attendance Rate</CardTitle>
            <CardDescription>Last 7 days average</CardDescription>
          </div>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl">{weekAverage}%</div>
          <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
              style={{ width: `${weekAverage}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
