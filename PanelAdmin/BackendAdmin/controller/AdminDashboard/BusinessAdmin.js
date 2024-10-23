const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const selectAllBusiness=async(req,res)=>{
    try{
const {data,error}=await supabase
       .from('business')
       .select('*');
        if(error){
            throw error;
        }
        res.status(200).json(data)
    }catch(err){
        res.status(500).send('Server Error');
    }
}
const selectBusinessById=async(req,res)=>{
    try{
const {id}=req.body
const{data,error}=await supabase
.from('business')
.select('*')
.eq('id',id)
if(error)throw error
res.status(200).json(data)
    }catch(err){
        res.status(500).send('Server Error');
    }
}
const updateBusiness = async (req, res) => {
    try {
        const { id, description, name, address, business_type, phone, email } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Business ID is required' });
        }

        const updateData = {};
        if (description !== undefined) updateData.description = description;
        if (name !== undefined) updateData.name = name;
        if (address !== undefined) updateData.address = address;
        if (business_type !== undefined) updateData.business_type = business_type;
        if (phone !== undefined) updateData.phone = phone;
        if (email !== undefined) updateData.email = email;
        updateData.updated_at = new Date().toISOString(); 

        const { data: businessData, error: fetchError } = await supabase
            .from('business')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error('Error fetching business:', fetchError);
            return res.status(500).json({ message: 'Error fetching business', error: fetchError });
        }

        if (!businessData) {
            return res.status(404).json({ message: 'Business not found' });
        }

        const { data: updatedBusiness, error: updateError } = await supabase
            .from('business')
            .update(updateData)
            .eq('id', id)
            .select();

        if (updateError) {
            console.error('Error updating business:', updateError);
            return res.status(500).json({ message: 'Error updating business', error: updateError });
        }

        res.status(200).json( 'Business updated successfully');
    } catch (err) {
        console.error('Unexpected error updating business:', err.message);
        return res.status(500).json({ message: 'Unexpected error updating business', error: err });
    }
};

const deleteBusiness=async(req,res)=>{
    try{
const{id}=req.body
const{data,error}= await supabase
    .from('business')
    .delete()
    .eq('id',id)
        if(error) throw error
        res.status(200).json('Business deleted successfully')
    }catch(err){
        res.status(500).send('Server Error');
    }
}
module.exports = {selectAllBusiness,selectBusinessById,updateBusiness,deleteBusiness}
