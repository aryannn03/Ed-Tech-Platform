const User = require("../models/User");

const OTP = require("../models/OTP");

const otpGenerator = require("otp-generator");

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
// sendOtp

// signup

// login


// changePassword