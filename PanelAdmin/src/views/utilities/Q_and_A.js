// src/components/QAndATable.js
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

function QAndATable() {
  const [qAndA, setQAndA] = useState([]);

  useEffect(() => {
    const fetchQAndA = async () => {
      const { data, error } = await supabase.from('q_and_a').select('*');

      if (error) {
        console.error('Error fetching Q&A:', error);
      } else {
        setQAndA(data);
      }
    };

    fetchQAndA();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom style={{ textAlign: 'center', color: '#00796B' }}>
        Q&A Management
      </Typography>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#00796B' }}>
              <TableCell style={{ color: '#FFFFFF' }}>Question</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Answer</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Created At</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Answered At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {qAndA.map((qa) => (
              <TableRow key={qa.id}>
                <TableCell>{qa.question}</TableCell>
                <TableCell>{qa.answer || 'Not answered yet'}</TableCell>
                <TableCell>{new Date(qa.created_at).toLocaleString()}</TableCell>
                <TableCell>{qa.answered_at ? new Date(qa.answered_at).toLocaleString() : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default QAndATable;
