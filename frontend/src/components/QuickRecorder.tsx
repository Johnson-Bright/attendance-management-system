import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Download, Eye, ArrowLeft, Trash2, Settings, FileText } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface RecordEntry {
  id: string;
  data: Record<string, string>;
}

interface Column {
  id: string;
  title: string;
}

export function QuickRecorder({ onBack }: { onBack: () => void }) {
  const [columns, setColumns] = useState<Column[]>([
    { id: '1', title: 'Name' },
    { id: '2', title: 'Email' },
  ]);
  const [records, setRecords] = useState<RecordEntry[]>([]);
  const [reportTitle, setReportTitle] = useState('');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) {
      toast.error('Please enter a column title');
      return;
    }

    const newColumn: Column = {
      id: Date.now().toString(),
      title: newColumnTitle.trim(),
    };

    setColumns(prev => [...prev, newColumn]);
    setNewColumnTitle('');
    toast.success('Column added successfully');
  };

  const handleRemoveColumn = (columnId: string) => {
    if (columns.length <= 1) {
      toast.error('You must have at least one column');
      return;
    }

    setColumns(prev => prev.filter(c => c.id !== columnId));
    toast.success('Column removed');
  };

  const handleAddRecord = () => {
    const hasData = Object.values(formData).some(value => value.trim());
    
    if (!hasData) {
      toast.error('Please fill in at least one field');
      return;
    }

    const newRecord: RecordEntry = {
      id: Date.now().toString(),
      data: { ...formData },
    };

    setRecords(prev => [...prev, newRecord]);
    setFormData({});
    setIsAddOpen(false);
    toast.success('Record added successfully');
  };

  const handleDeleteRecord = (recordId: string) => {
    setRecords(prev => prev.filter(r => r.id !== recordId));
    toast.success('Record deleted');
  };

  const handleDownload = () => {
    if (records.length === 0) {
      toast.error('No records to download');
      return;
    }

    if (!reportTitle.trim()) {
      toast.error('Please enter a report title/header');
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Add title/header
      doc.setFontSize(18);
      doc.text(reportTitle, 14, 20);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 28);
      
      // Add table
      const tableColumn = columns.map(col => col.title);
      const tableRows = records.map(record => 
        columns.map(col => record.data[col.id] || '-')
      );
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [59, 130, 246] },
      });
      
      // Add footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Page ${i} of ${pageCount} | Total Records: ${records.length}`,
          14,
          doc.internal.pageSize.height - 10
        );
      }
      
      // Download
      doc.save(`${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl">Quick Recorder</h1>
              <p className="text-sm text-muted-foreground">Record and manage data with custom columns</p>
            </div>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Report Title Input */}
          <Card>
            <CardHeader>
              <CardTitle>Report Information</CardTitle>
              <CardDescription>
                Set the title/header for your report (required for PDF download)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="reportTitle">
                  <FileText className="h-4 w-4 inline mr-2" />
                  Report Title/Header *
                </Label>
                <Input
                  id="reportTitle"
                  placeholder="e.g., Attendance Report, Member List, Event Participants..."
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This will appear as the main heading in your PDF report
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Columns ({columns.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configure Columns</DialogTitle>
                  <DialogDescription>
                    Add or remove columns for your records
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Add New Column</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Column title"
                        value={newColumnTitle}
                        onChange={(e) => setNewColumnTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                      />
                      <Button onClick={handleAddColumn}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Current Columns</Label>
                    <div className="space-y-2">
                      {columns.map((col) => (
                        <div key={col.id} className="flex items-center justify-between p-2 border rounded">
                          <span>{col.title}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveColumn(col.id)}
                            disabled={columns.length <= 1}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Record
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Record</DialogTitle>
                  <DialogDescription>
                    Fill in the information for this record
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {columns.map((col) => (
                    <div key={col.id} className="space-y-2">
                      <Label htmlFor={col.id}>{col.title}</Label>
                      <Input
                        id={col.id}
                        placeholder={`Enter ${col.title.toLowerCase()}`}
                        value={formData[col.id] || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, [col.id]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <Button onClick={handleAddRecord} className="w-full">
                    Save Record
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Records ({records.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Recorded Data</DialogTitle>
                  <DialogDescription>
                    All saved records
                  </DialogDescription>
                </DialogHeader>
                {records.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No records added yet
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map((col) => (
                          <TableHead key={col.id}>{col.title}</TableHead>
                        ))}
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.map((record) => (
                        <TableRow key={record.id}>
                          {columns.map((col) => (
                            <TableCell key={col.id}>
                              {record.data[col.id] || '-'}
                            </TableCell>
                          ))}
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteRecord(record.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={handleDownload} disabled={records.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>

          {/* Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Preview</CardTitle>
              <CardDescription>
                Latest 5 records
              </CardDescription>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="mb-4">No records yet. Start by adding your first record!</p>
                  <Button onClick={() => setIsAddOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Record
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((col) => (
                        <TableHead key={col.id}>{col.title}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.slice(-5).reverse().map((record) => (
                      <TableRow key={record.id}>
                        {columns.map((col) => (
                          <TableCell key={col.id}>
                            {record.data[col.id] || '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Records</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl">{records.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Columns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl">{columns.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-600">Ready to Record</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}