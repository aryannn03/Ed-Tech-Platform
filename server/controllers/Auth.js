const User = require("../models/User");

const OTP = require("../models/OTP");

const otpGenerator = require("otp-generator");
const bcrypt=require('bcrypt');
// send OTP

exports.sendOTP = async(req,res)=>{

    try{
        // fetch email from request body
        const {email} = req.body;
        const  checkUserPresent = await User.findOne(email);
    
        // check user exists
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:'User already registered'
            })
        }
        
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })
        console.log("OTP Generated: ",otp);
        let result = await OTP.findOne({otp:otp});
        while(result){
                otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });    
            result = await OTP.findOne({otp:otp});
        }
        const otpPayload = {email,otp};

        // make entry in DB
        const otpBody=await OTP.create(otpPayload);
        console.log(otpBody);
        res.status(200).json({
            success:true,
            message:'OTP sent successfully'
        })

            
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }

};


// signup
exports.signUp=async (req,res)=>{
    
    try{
        // data from req body
    const {firstName,lastName,email,password,accountType,contactNumber,confirmPassword,otp} = req.body;
    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
        return res.status(400).json({
            success:false,
            message:'All fields are required'
        })
    }
    if(password !== confirmPassword){
        return res.status(400).json({
            success:false,
            message:'Password and Confirm Password do not match'
        })
    }
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(401).json({
            success:false,
            message:'User already registered'
        })
    }
    const recentOTP = await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOTP);
    if(recentOTP.length === 0){
        return res.status(400).json({
            success:false,
            message:'OTP not found, please request for a new OTP'
        })
    }
    if(recentOTP.otp !== otp){
        return res.status(400).json({
            success:false,
            message:'Invalid OTP'
        })
    }
    const profileDetails=await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null,
    })
// hashed password
    const hasedPassword = await bcrypt.hash(password,10);
    const user=await User.create({
        firstName, 
        lastName,
        email,
        password:hasedPassword,
        accountType,
        contactNumber,
        additionalDetails:profileDetails._id,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    });
    return res.status(200).json({
        success:true,
        message:"User registered successfully",
        user,
    })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered. Please try again."
        })
        
    }
}

// login


// changePassword