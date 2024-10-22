const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const selectAllServices=async(req,res)=>{
    try{
const {data,error}=await supabase
       .from('services')
       .select('*');
        if(error) throw error;
        
        res.status(200).json(data)
    }catch(err){
        console.error('Error fetching services:', err.message);
        res.status(500).send('Server error');
    }
}
const selectServiceById=async(req,res)=>{
    try{
const {id}=req.body
const{data,error}=await supabase
       .from('services')
       .select('*')
       .eq('id',id);
        if(error) throw error;
        
        res.status(200).json(data)
    }catch(err){
        console.error('Error fetching service:', err.message);
        res.status(500).send('Server error');
    }
}
const updateService = async (req, res) => {
    try {
        const { id, name, duration, reordering, service_type, description, price } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Service ID is required' });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (duration !== undefined) updateData.duration = duration;
        if (reordering !== undefined) updateData.reordering = reordering;
        if (service_type !== undefined) updateData.service_type = service_type;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = price;
        updateData.updated_at = new Date().toISOString(); 

        const { data: serviceData, error: fetchError } = await supabase
            .from('services')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error('Error fetching service:', fetchError);
            return res.status(500).json({ message: 'Error fetching service', error: fetchError });
        }

        if (!serviceData) {
            return res.status(404).json({ message: 'Service not found' });
        }

        const { data: updatedData, error: updateError } = await supabase
            .from('services')
            .update(updateData)
            .eq('id', id)
            .select();

        if (updateError) {
            console.error('Error updating service:', updateError);
            return res.status(500).json({ message: 'Error updating service', error: updateError });
        }

        res.status(200).json( 'Service updated successfully');
    } catch (err) {
        console.error('Unexpected error updating service:', err.message);
        return res.status(500).json({ message: 'Unexpected error updating service', error: err });
    }
};

const deleteService=async(req,res)=>{
    try{
const{id}=req.body
const{data,error}=await supabase
       .from('services')
       .delete()
       .eq('id',id);
        if(error) throw error;
        
        res.status(200).json('Service deleted successfully');
    }catch(err){
        console.error('Error deleting service:', err.message);
        res.status(500).send('Server error');
    }
}

module.exports = {selectAllServices,selectServiceById,updateService,deleteService}
