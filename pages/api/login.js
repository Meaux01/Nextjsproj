export default function handler(req,res){
    const {email,password} = req.body
    if(email === req.email && password === req.password){
        res.status(200).json({message: 'Login Successful'})
    }else{
        res.status(401).json({message:'Invalid credentials'})
    }
}