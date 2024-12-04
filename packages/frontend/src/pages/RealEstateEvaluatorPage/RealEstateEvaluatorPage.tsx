import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import { FiUpload, FiDownload, FiRefreshCw } from 'react-icons/fi';

declare const XLSX: any;

interface TableRecord {
  Ranking: number;
  Comments: string;
  "Property Name": string;
  "Risk Assessment": string;
  "Price (USD)": number;
  "10 Year Value (Mod)": number;
}

const RealEstateEvaluatorPage: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [records, setRecords] = useState<TableRecord[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('');

    try {
      const userId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem('userId', userId);

      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      const dataWithUserId = json.map((row: any) => ({ ...row, userId }));

      const response = await fetch('https://hook.us2.make.com/evo9x4xtw2azny03412ps8ob64inrnr8', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: dataWithUserId })
      });

      if (response.ok) {
        setUploadStatus('File uploaded successfully! Click "Load Results" to view the analysis.');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setUploadStatus('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const fetchResults = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setUploadStatus('Please upload a file first.');
      return;
    }

    setIsLoading(true);
    try {
      const apiKey = "pat8IxpIwBQD7y0V2.23502f2f6fb0261ac29dd79ec750b2550b7ba464a2d63c766f7d278ad1061527";
      const baseId = "appgHDDAuPyLlfRtV";
      const tableName = "Table%201";
      const url = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula={userId}="${userId}"`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch results');

      const data = await response.json();
      const sortedRecords = data.records
        .map((record: any) => record.fields)
        .sort((a: any, b: any) => (b.Ranking || 0) - (a.Ranking || 0));

      setRecords(sortedRecords);
    } catch (error) {
      console.error('Error:', error);
      setUploadStatus('Error loading results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCSV = () => {
    if (records.length === 0) return;

    const headers = ["Ranking", "Comments", "Property Name", "Risk Assessment", "Price (USD)", "10 Year Value"];
    const csvContent = [
      headers.join(','),
      ...records.map(record => [
        record.Ranking || 'N/A',
        `"${record.Comments || ''}"`,
        `"${record["Property Name"] || ''}"`,
        `"${record["Risk Assessment"] || ''}"`,
        record["Price (USD)"] ? `$${record["Price (USD)"]}` : 'N/A',
        record["10 Year Value (Mod)"] ? `$${record["10 Year Value (Mod)"]}` : 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'real-estate-analysis.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: 'var(--background-default)',
      pt: 3,
      pb: 6
    }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ 
          fontWeight: 600,
          color: 'var(--text-primary)',
          mb: 4
        }}>
          Real Estate Evaluator
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            backgroundColor: 'var(--card-background)',
            mb: 4,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <input
              type="file"
              id="file-upload"
              accept=".xlsx,.xls,.csv,.gsheet"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload">
              <Button
                component="span"
                variant="contained"
                startIcon={isUploading ? <CircularProgress size={20} /> : <FiUpload />}
                disabled={isUploading}
                sx={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--text-white)',
                  '&:hover': { 
                    backgroundColor: 'var(--primary-dark)',
                    color: 'var(--text-white)'
                  }
                }}
              >
                {isUploading ? 'Uploading...' : 'Upload Properties Sheet'}
              </Button>
            </label>

            {uploadStatus && (
              <Typography sx={{ mt: 2, color: 'var(--text-primary)' }}>
                {uploadStatus}
              </Typography>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={isLoading ? <CircularProgress size={20} /> : <FiRefreshCw />}
                onClick={fetchResults}
                disabled={isLoading}
                sx={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--text-white)',
                  '&:hover': { 
                    backgroundColor: 'var(--primary-dark)',
                    color: 'var(--text-white)'
                  }
                }}
              >
                {isLoading ? 'Loading...' : 'Load Results'}
              </Button>

              {records.length > 0 && (
                <Button
                  variant="contained"
                  startIcon={<FiDownload />}
                  onClick={downloadCSV}
                  sx={{
                    backgroundColor: '#28a745',
                    color: 'var(--text-white)',
                    '&:hover': { 
                      backgroundColor: '#218838',
                      color: 'var(--text-white)'
                    }
                  }}
                >
                  Download CSV
                </Button>
              )}
            </Box>
          </Box>

          {records.length > 0 && (
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--background-paper)' }}>
                    <th style={{ padding: '12px', border: '1px solid var(--border-color)', color: 'var(--primary)' }}>Ranking</th>
                    <th style={{ padding: '12px', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>Property Name</th>
                    <th style={{ padding: '12px', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>Comments</th>
                    <th style={{ padding: '12px', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>Risk Assessment</th>
                    <th style={{ padding: '12px', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>Price (USD)</th>
                    <th style={{ padding: '12px', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>10 Year Value</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={index}>
                      <td style={{ padding: '12px', border: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
                        {record.Ranking || 'N/A'}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                        {record["Property Name"] || 'N/A'}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '14px' }}>
                        {record.Comments || 'No Comments'}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                        {record["Risk Assessment"] || 'N/A'}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid var(--border-color)', textAlign: 'right', color: 'var(--text-primary)' }}>
                        {record["Price (USD)"] ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(record["Price (USD)"]) : 'N/A'}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                        {record["10 Year Value (Mod)"] ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(record["10 Year Value (Mod)"]) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default RealEstateEvaluatorPage;
