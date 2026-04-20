const User = require('../models/User');

const getPendingUsers = async(req,res)=>{

try{

const users=
await User.find({

role:{
$in:['ngo','volunteer']
},

verificationStatus:'Pending'

});

res.json(users);

}

catch(error){

res.status(500).json({
message:error.message
});

}

};



const updateVerificationStatus=
async(req,res)=>{

try{

const user=
await User.findById(
req.params.id
);

if(!user){

return res.status(404).json({
message:'User not found'
});

}

user.verificationStatus=
req.body.verificationStatus;

await user.save();

res.json(user);

}

catch(error){

res.status(500).json({
message:error.message
});

}

};


module.exports={
getPendingUsers,
updateVerificationStatus
};