const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const selectAllComplaints=async(req,res)=>{
    try{
const {data,error}=await supabase
.from('complaints')
.select('*')
if(error)throw error
res.status(200).json(data)                                              

    }catch(err){
res.status(500).send('Server Error')    
    }
}
const selectComplaintsById=async(req,res)=>{
    try{
const {id}=req.body
const {data,error}=await supabase
.from('complaints')
.select('*')
.eq('id',id)
if(error)throw error
res.status(200).json(data)
    }catch(err){
res.status(500).send('Server Error')    
    }
}   

const deleteComplaintsById=async(req,res)=>{
    try{
const {id}=req.body
const {data,error}=await supabase
.from('complaints')
.delete()
.eq('id',id)    
    }catch(err){
res.status(500).send('Server Error')    
    }
}   
const updateComplaintsById=async(req,res)=>{
    try{
const {id}=req.body
const {data,error}=await supabase
.from('complaints')
.update(req.body)
.eq('id',id)        
    }catch(err){
res.status(500).send('Server Error')    
    }  

}  
const createComplaints=async(req,res)=>{
    try{
const {data,error}=await supabase
.from('complaints')
.insert(req.body)
if(error)throw error
res.status(200).json(data)
    }catch(err){
res.status(500).send('Server Error')    
    }
}                                       



module.exports={selectAllComplaints,selectComplaintsById,deleteComplaintsById,updateComplaintsById,createComplaints}
