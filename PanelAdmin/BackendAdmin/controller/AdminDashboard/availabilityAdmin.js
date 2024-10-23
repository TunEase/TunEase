const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const selectAllAvailability = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('availability')
            .select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching availability:', err.message);
        res.status(500).send('Server error');
    }

};
const selectAvailabilityById = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Availability ID is required' });
        }
        const { data, error } = await supabase
            .from('availability')
            .select('*')
            .eq('id', id);
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching availability by ID:', err.message);
        res.status(500).send('Server error');
    }   
};
const updateAvailability = async (req, res) => {
    try {
        const { id, ...updateData } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Availability ID is required' });
        }
        const { data, error } = await supabase
            .from('availability')
            .update(updateData)
            .eq('id', id);
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        console.error('Error updating availability:', err.message);
        res.status(500).send('Server error');
    }
};
const deleteAvailability = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Availability ID is required' });
        }
        const { data, error } = await supabase
            .from('availability')
            .delete()
            .eq('id', id);
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        console.error('Error deleting availability:', err.message);
        res.status(500).send('Server error');
    }
};




module.exports = { selectAllAvailability, selectAvailabilityById, updateAvailability, deleteAvailability };     


