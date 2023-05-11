import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcrypt";


/* create or find */ 

export const  findOrCreateuser = async (user)=> {

   const findUser = await User.findOne({ email: user.email }).exec();
   // console.log(findUser);
   if(findUser) return {findUser};
   else {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(Math.floor(Math.random()*100000000000).toString(), salt);
    await  User.insertMany([
        {
            firstName: user.firstName,
            lastName:  user.lastName,
            email: user.email,
            password: passwordHash,
            picturePath: user.profile,
            friends: [],
            location: "",
            occupation: "",
            viewedProfile: Math.floor(Math.random() * 10000), //random view coount
            impressions: Math.floor(Math.random() * 10000), // random impressions count
            loginType: user.login

          },
        
     ])

     const findUser = await User.findOne({ email: user.email }).exec();
     // console.log(findUser);

     return {findUser}


   }
}

/* update user*/
export const updateUserWithId = async (id,userDto)=> {


  const res = await User.findByIdAndUpdate(id, userDto);
  let  user = await User.findById(id);
  return user;
}