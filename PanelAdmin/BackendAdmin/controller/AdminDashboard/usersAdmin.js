const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const selectAllUsers= async (req, res) =>{
  try {
    const { data, error } = await supabase
      .from('user_profile') 
      .select('*');
    
    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users' });
  }
}
const selectUserById = async (req, res) => {
  try {
    const { id } = req.body;
    console.log('Received ID:', id); 

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const { data, error } = await supabase
      .from('user_profile')
      .select('*')
      .eq('id', id);

    if (error) {
      console.error('Database error:', error.message);
      return res.status(500).json({ message: 'Database error occurred' });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(data[0]);
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};





module.exports = { selectAllUsers ,selectUserById}
