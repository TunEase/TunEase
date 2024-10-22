const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const selectAllreviews = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching reviews:', err.message);
        res.status(500).send('Server error');
    }
};

const selectreviewsById = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'reviews ID is required' });
        }
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('id', id);
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching reviews:', err.message);
        res.status(500).send('Server error');
    }
};

const createreviews = async (req, res) => {
    try {
        const { userId, score, comment } = req.body;
        const { data, error } = await supabase
            .from('reviews')
            .insert([{ user_id: userId, score, comment }]);
        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        console.error('Error creating reviews:', err.message);
        res.status(500).send('Server error');
    }
};

const updatereviews = async (req, res) => {
    try {
        const { id, score, comment } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'reviews ID is required' });
        }
        const { data, error } = await supabase
            .from('reviews')
            .update({ score, comment })
            .eq('id', id);
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        console.error('Error updating reviews:', err.message);
        res.status(500).send('Server error');
    }
};

const deletereviews = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'reviews ID is required' });
        }
        const { data, error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', id);
        if (error) throw error;
        res.status(200).json('reviews deleted successfully');
    } catch (err) {
        console.error('Error deleting reviews:', err.message);
        res.status(500).send('Server error');
    }
};

module.exports = { selectAllreviews, selectreviewsById, createreviews, updatereviews, deletereviews };