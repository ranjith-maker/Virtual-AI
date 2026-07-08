import User from '../models/userModel.js'
import AppError, { catchAsync } from '../utils/CustomError.js'
import geminiResponse from '../utils/gemini.js'
import {uploadImagetoCloudinary} from '../utils/ImageUploader.js'
import moment from 'moment'



export const getProfile = catchAsync(async(req , res , next)=>{

const user = req.user

return res.status(200).json({
    success : true ,
    message : 'Fetched User Profile Successfully',
    data : user
})

})



export const updateAssistant = catchAsync(async (req, res, next) => {

  const { assistantName, assistantImg } = req.body;

  const user = req.user;


  if (!assistantName || (!assistantImg && !req.file)) {
    throw new AppError('Name and Image both are important',400)
  }

  let image = assistantImg; // predefined image URL


  // If user uploads his own image
  if (req.file) {
    const uploadedImage = await uploadImagetoCloudinary(req.file);
    image = uploadedImage.secure_url;
  }


  const updatedUser = await User.findByIdAndUpdate(user._id,
    {
      assistantImg: image,
      assistantName : assistantName
    },
    {
      new: true
    }
  );


  return res.status(200).json({
    success: true,
    message: "User updated assistant name and image",
    data: updatedUser
  });

});


export const askToAssistant = catchAsync(async(req,res,next)=>{


    const { command } = req.body;

    const id = req.user._id;

    const user = await User.findById(id);

    const userName = user.name;
    const assistantName = user.assistantName;


    const gemResult = await geminiResponse(
        command,
        assistantName,
        userName
    );


    if(!gemResult){
        return res.status(400).json({
            response: "Sorry, I couldn't understand."
        });
    }

    

    const type = gemResult.type;

switch(type){

  case "get_date":

    return res.status(200).json({
     type,
     userInput: gemResult.userInput,
     response: `Today's date is ${moment().format("YYYY-MM-DD")}`
        });

  case "get_time":

     return res.status(200).json({
         type,
         userInput: gemResult.userInput,
         response: `The current time is ${moment().format("hh:mm A")}`
     });

 case "get_month":

     return res.status(200).json({
         type,
         userInput: gemResult.userInput,
         response: `The current month is ${moment().format("MMMM")}`
     });

 case "google_search":
 case "youtube_search":
 case "youtube_play":
 case "spotify_play":
 case "weather_show":
 case "linkedin_open":
 case "facebook_open":
 case "instagram_open":
 case "calculator_open":

 return res.status(200).json({
     type,
     userInput: gemResult.userInput,
     response: gemResult.response
     });


 case "general":

    return res.status(200).json({
     type,
     userInput: gemResult.userInput,
     response: gemResult.response
     });


 default:

    return res.status(400).json({
        response: "I didn't understand that command."
    });

    }

});



