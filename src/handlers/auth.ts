const jwt=require('jsonwebtoken')
import {User} from '../models/userModel'

//After running this handler we don't need to verify user anymore
export const checkForAuthorization=async(req:any,res:any,next:Function)=>{
    
    try{
        //Extract token from Authorization header, then verify it
        const authorizationHeader=req.header('Authorization')
        const token=authorizationHeader.replace('Bearer ','')
        const decodedTokenPayload=jwt.verify(token,'thisisanodecourse') //should be in an .env file

        //Find User corresponding to the decoded token
        const user = await User.findOne({_id:decodedTokenPayload._id,'tokens.token':token})
        
        if(!user)
            throw new Error()
        
        req.user=user //give access to user for next route handler
        req.token=token //send token to request to be able to remove it when logging out                    
        next()

    }catch(e){
        res.status(401).send('Error: Please authenticate properly')
    }
}