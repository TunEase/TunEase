const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const selectAllNotifications = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching notifications:', err.message);
        res.status(500).send('Server error');
    }
};

const selectNotificationById = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Notification ID is required' });
        }
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('id', id);
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching notification:', err.message);
        res.status(500).send('Server error');
    }
};

const createNotification = async (req, res) => {
    try {
        const { title, message } = req.body;
        const { data, error } = await supabase
            .from('notifications')
            .insert([{ title, message }]);
        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        console.error('Error creating notification:', err.message);
        res.status(500).send('Server error');
    }
};

const updateNotification = async (req, res) => {
    try {
        const { id, title, message } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Notification ID is required' });
        }
        const { data, error } = await supabase
            .from('notifications')
            .update({ title, message })
            .eq('id', id);
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        console.error('Error updating notification:', err.message);
        res.status(500).send('Server error');
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Notification ID is required' });
        }
        const { data, error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id);
        if (error) throw error;
        res.status(200).json('Notification deleted successfully');
    } catch (err) {
        console.error('Error deleting notification:', err.message);
        res.status(500).send('Server error');
    }
};

module.exports = { selectAllNotifications, selectNotificationById, createNotification, updateNotification, deleteNotification };