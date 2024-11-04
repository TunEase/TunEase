import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
const ServicesTable = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDisabled, setShowDisabled] = useState(false);
  const servicesPerPage = 5;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        let query = supabase.from('services').select('*');

        if (searchTerm) {
          query = query.ilike('name', `%${searchTerm}%`);
        }

        if (showDisabled) {
          query = query.eq('disable_service', true);
        }

        const { data, error } = await query.range((page - 1) * servicesPerPage, page * servicesPerPage - 1);
        if (error) throw error;
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, [page, searchTerm, showDisabled]);

  const handleManageClick = (serviceId) => {
    console.log('Manage service with ID:', serviceId);
    navigate(`/utils/${serviceId}`);
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom style={{ textAlign: 'center', color: '#00796B' }}>
        Services Management
      </Typography>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '300px' }}
        />
        <br />
        <FormControlLabel
          control={<Checkbox checked={showDisabled} onChange={(e) => setShowDisabled(e.target.checked)} />}
          label="Show Disabled Services"
        />
      </div>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#00796B' }}>
              <TableCell style={{ color: '#FFFFFF' }}>ID</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Name</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Description</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Price</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.id}</TableCell>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>{service.price}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: '#00796B', color: '#FFFFFF', paddingBottom: '5px' }}
                    onClick={() => handleManageClick(service.id)}
                  >
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          onClick={handlePreviousPage}
          disabled={page === 1}
          style={{ backgroundColor: '#00796B', color: '#FFFFFF' }}
        >
          Previous
        </Button>
        <Button variant="contained" onClick={handleNextPage} style={{ backgroundColor: '#00796B', color: '#FFFFFF' }}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default ServicesTable;
