const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const selectAllAppointment = async (req, res) => {
    try {
      const { data: appointments, error: appointmentError } = await supabase
        .from('appointments')
        .select('*');
  
      if (appointmentError) {
        throw appointmentError;
      }
  
      const appointmentsWithClientName = await Promise.all(
        appointments.map(async (appointment) => {
          const { data: userProfile, error: userProfileError } = await supabase
            .from('user_profile')
            .select('name')
            .eq('id', appointment.client_id)
            .single(); 
  
          if (userProfileError) {
            throw userProfileError;
          }
          const { data: serviceProfile, error: serviceProfileError } = await supabase
          .from('services')
          .select('name')
          .eq('id', appointment.service_id) 
          .single();

        if (serviceProfileError) {
          throw serviceProfileError;
        }
          return {
            ...appointment,
            client_name: userProfile.name,
            service_name: serviceProfile.name,
          };
        })
      );
  
      res.status(200).json(appointmentsWithClientName);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };
  
  
  const selectAppointmentById = async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ message: 'Appointment ID is required' });
      }
  
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .single(); 
  
      if (appointmentError) {
        throw appointmentError;
      }
  
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
  
      const { data: userProfile, error: userProfileError } = await supabase
        .from('user_profile')
        .select('name')
        .eq('id', appointment.client_id)
        .single(); 
  
      if (userProfileError) {
        throw userProfileError;
      }
  
      const { data: serviceProfile, error: serviceProfileError } = await supabase
        .from('services')
        .select('name')
        .eq('id', appointment.service_id) 
        .single();
  
      if (serviceProfileError) {
        throw serviceProfileError;
      }
  
      const appointmentWithDetails = {
        ...appointment,
        client_name: userProfile.name,
        service_name: serviceProfile.name,
      };
  
      res.status(200).json(appointmentWithDetails);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };
  
const updateAppointment = async (req, res) => {
    try {
        const { id, date, start_time, end_time, status } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Appointment ID is required' });
        }

        const updateData = {};
        if (date !== undefined) updateData.date = date;
        if (start_time !== undefined) updateData.start_time = start_time;
        if (end_time !== undefined) updateData.end_time = end_time;
        if (status !== undefined) {
            console.log('Status to update:', status);
            updateData.status = status; 
        }
        updateData.updated_at = new Date().toISOString(); 

        const { data: appointmentData, error: fetchError } = await supabase
            .from('appointments')
            .select('*')
            .eq('id', id)
            .single(); 

        if (fetchError) {
            console.error('Error fetching appointment:', fetchError);
            return res.status(500).json({ message: 'Error fetching appointment', error: fetchError });
        }

        if (!appointmentData) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const { data, error: updateError } = await supabase
            .from('appointments')
            .update(updateData)
            .eq('id', id)
            .select();

        if (updateError) {
            console.error('Error updating appointment:', updateError);
            return res.status(500).json({ message: 'Error updating appointment', error: updateError });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'Appointment not found or not updated' });
        }

        res.status(200).json( 'Appointment updated successfully');
    } catch (err) {
        console.error('Server error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Appointment ID is required' });
        }

        const validStatuses = ["SCHEDULED", "COMPLETED", "CANCELLED"]; 
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Allowed values are: ${validStatuses.join(", ")}` });
        }

        const { data: appointmentData, error: fetchError } = await supabase
            .from('appointments')
            .select('*')
            .eq('id', id);

        if (fetchError) {
            console.error('Error fetching appointment:', fetchError);
            return res.status(500).json({ message: 'Error fetching appointment', error: fetchError });
        }

        if (!appointmentData || appointmentData.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const { data, error } = await supabase
            .from('appointments')
            .update({ status })
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating appointment:', error);
            return res.status(500).json({ message: 'Error updating appointment', error });
        }

        res.status(200).json(data);
    } catch (err) {
        console.error('Server error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


  
  
module.exports = {selectAllAppointment ,selectAppointmentById,updateAppointment,updateStatus}
