import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  List,
  ListItem,
  ListItemText,
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
import { useParams } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [media, setMedia] = useState([]);
  const [qAndA, setQAndA] = useState([]);
  const [eligibility, setEligibility] = useState([]);
  const [fees, setFees] = useState([]);
  const [businessOwner, setBusinessOwner] = useState(null);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [likesData, setLikesData] = useState([]);
  const [reviewsData, setReviewsData] = useState([]);
  const [view, setView] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const { data: serviceData, error: serviceError } = await supabase.from('services').select('*').eq('id', serviceId).single();
        if (serviceError) throw serviceError;
        setService(serviceData);

        const { data: mediaData, error: mediaError } = await supabase.from('media').select('*').eq('service_id', serviceId);
        if (mediaError) throw mediaError;
        setMedia(mediaData);

        const { data: qAndAData, error: qAndAError } = await supabase.from('q_and_a').select('*').eq('service_id', serviceId);
        if (qAndAError) throw qAndAError;
        setQAndA(qAndAData);

        const { data: eligibilityData, error: eligibilityError } = await supabase
          .from('eligibility')
          .select('*')
          .eq('service_id', serviceId);
        if (eligibilityError) throw eligibilityError;
        setEligibility(eligibilityData);

        const { data: feesData, error: feesError } = await supabase.from('fees').select('*').eq('service_id', serviceId);
        if (feesError) throw feesError;
        setFees(feesData);

        const { data: businessData, error: businessError } = await supabase
          .from('business')
          .select('*, user_profile(*)')
          .eq('id', serviceData.business_id)
          .single();
        if (businessError) throw businessError;
        setBusinessOwner(businessData.user_profile);

        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*')
          .eq('service_id', serviceId);
        if (appointmentsError) throw appointmentsError;
        setAppointmentsData(appointmentsData);

        const { data: likesData, error: likesError } = await supabase
          .from('likes')
          .select('date, count(*)')
          .eq('service_id', serviceId)
          .group('date');
        if (likesError) throw likesError;
        setLikesData(likesData);

        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('date, count(*)')
          .eq('service_id', serviceId)
          .group('date');
        if (reviewsError) throw reviewsError;
        setReviewsData(reviewsData);
      } catch (error) {
        console.error('Error fetching service details:', error);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  if (!service) return <div>Loading...</div>;

  const toggleView = (section) => {
    setView((prevView) => (prevView === section ? null : section));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAppointments = appointmentsData.filter((appointment) =>
    appointment.client_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="contained" onClick={() => toggleView('appointments')} style={{ backgroundColor: '#00796B', color: '#FFFFFF' }}>
          View Appointments
        </Button>
        <TextField
          label="Search..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ margin: '0 16px', flexGrow: 1 }}
        />
        <Button variant="contained" onClick={() => toggleView('q_and_a')} style={{ backgroundColor: '#00796B', color: '#FFFFFF' }}>
          View Q&A
        </Button>
      </div>

      {view === 'appointments' && (
        <>
          <Typography variant="h5" style={{ marginTop: '16px', color: '#00796B', fontWeight: 'bold' }}>
            Appointments
          </Typography>
          <TableContainer component={Paper} style={{ marginTop: '10px' }}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#00796B' }}>
                  <TableCell style={{ color: '#FFFFFF' }}>Service ID</TableCell>
                  <TableCell style={{ color: '#FFFFFF' }}>Client ID</TableCell>
                  <TableCell style={{ color: '#FFFFFF' }}>Date</TableCell>
                  <TableCell style={{ color: '#FFFFFF' }}>Start Time</TableCell>
                  <TableCell style={{ color: '#FFFFFF' }}>End Time</TableCell>
                  <TableCell style={{ color: '#FFFFFF' }}>Status</TableCell>
                  <TableCell style={{ color: '#FFFFFF' }}>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.service_id}</TableCell>
                    <TableCell>{appointment.client_id}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.start_time}</TableCell>
                    <TableCell>{appointment.end_time}</TableCell>
                    <TableCell>{appointment.status}</TableCell>
                    <TableCell>{new Date(appointment.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {view === 'q_and_a' && (
        <>
          <Typography variant="h5" style={{ marginTop: '16px', color: '#00796B', fontWeight: 'bold' }}>
            Q&A
          </Typography>
          <List>
            {qAndA.map((qa) => (
              <ListItem key={qa.id}>
                <ListItemText primary={qa.question} secondary={qa.answer || 'Not answered yet'} />
              </ListItem>
            ))}
          </List>
        </>
      )}

      <Typography variant="h5" style={{ marginTop: '16px', color: '#00796B', fontWeight: 'bold' }}>
        Media Gallery
      </Typography>
      <div style={{ display: 'flex', overflowX: 'auto', padding: '10px 0' }}>
        {media.map((item) => (
          <Card
            key={item.id}
            style={{ minWidth: '150px', marginRight: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}
          >
            <CardMedia component="img" height="100" image={item.media_url} alt={item.media_type} />
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                {item.media_type}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      <Typography variant="h5" style={{ marginTop: '16px', color: '#00796B', fontWeight: 'bold' }}>
        Eligibility
      </Typography>
      <Grid container spacing={2}>
        {eligibility.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
              <CardContent>
                <Typography variant="h6" style={{ color: '#00796B' }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" style={{ color: '#333' }}>
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" style={{ marginTop: '16px', color: '#00796B', fontWeight: 'bold' }}>
        Fees
      </Typography>
      <Grid container spacing={2}>
        {fees.map((fee) => (
          <Grid item xs={12} sm={6} md={4} key={fee.id}>
            <Card style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
              <CardContent>
                <Typography variant="h6" style={{ color: '#00796B' }}>
                  {fee.name}
                </Typography>
                <Typography variant="body2" style={{ color: '#333' }}>
                  ${fee.fee} - {fee.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" style={{ marginTop: '16px', color: '#00796B', fontWeight: 'bold' }}>
        Business Owner
      </Typography>
      {businessOwner && (
        <div>
          <Typography variant="body1" style={{ color: '#333' }}>
            Name: {businessOwner.name}
          </Typography>
          <Typography variant="body1" style={{ color: '#333' }}>
            Email: {businessOwner.email}
          </Typography>
        </div>
      )}
    </Paper>
  );
};

export default ServiceDetail;
