const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const selectAllMedia = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('media')
            .select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching media:', err.message);
        res.status(500).send('Server error');
    }
};

const selectMediaById = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Media ID is required' });
        }
        const { data, error } = await supabase
            .from('media')
            .select('*')
            .eq('id', id);
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching media:', err.message);
        res.status(500).send('Server error');
    }
};

const createMedia = async (req, res) => {
    try {
        const { title, url } = req.body;
        const { data, error } = await supabase
            .from('media')
            .insert([{ title, url }]);
        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        console.error('Error creating media:', err.message);
        res.status(500).send('Server error');
    }
};

const updateMedia = async (req, res) => {
    try {
        const { id, title, url } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Media ID is required' });
        }
        const { data, error } = await supabase
            .from('media')
            .update({ title, url })
            .eq('id', id);
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        console.error('Error updating media:', err.message);
        res.status(500).send('Server error');
    }
};

const deleteMedia = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Media ID is required' });
        }
        const { data, error } = await supabase
            .from('media')
            .delete()
            .eq('id', id);
        if (error) throw error;
        res.status(200).json('Media deleted successfully');
    } catch (err) {
        console.error('Error deleting media:', err.message);
        res.status(500).send('Server error');
    }
};

module.exports = { selectAllMedia, selectMediaById, createMedia, updateMedia, deleteMedia };