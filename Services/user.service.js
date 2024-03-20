import {User} from "../models/User.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import Jwt  from "jsonwebtoken"




const generateAccessAndRefreshTokens = async (userId) => {
    try {
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
  
      //we have designed a refresh tekon in our db schema so we have to save it there!
      user.refreshToken = refreshToken;
      // we have updated our user so now we have to save it in db
  
      await user.save({ validateBeforeSave: false }); //validatebeforesave means that if db wants some validation on tokens then it save with out it!
  
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(
        500,
        "something went wrong while generating the access and refresh tokens!"
      );
    }
  };
  const registerUser = asyncHandler(async (req, res) => { 
    // res.status(200).json({
    //   message: "We are going in right direction",
    // });
  
    //steps to register a user
    //1 get user details from frontend
    //2 validation - if something they sent is empty
    //3 check if user already exist : username
    //4 create user object to upload data in mongodb
    //5 remove password and refresh token field from response
    //6 check for user creation
    //7 return response
  
    //1 getting user from frontend(but now postman)
  
    const { password, userName } = req.body; //in req.body we can find all the details regarding our project
    console.log("userName: ", userName);
  
    //2 checking validation
  
    if (
      [password, userName].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }
  
    //3 check if user already exist or not
    //here we can use if else statements to check but there is an advanced method to check
  
    // const existedUser = await User.findOne({
    //   $or: [{ userName }, { email }],
    // });
   
  
     //checking db if this username already exist!
     existedUserByUserName = await User.findOne({userName});
     if (existedUserByUserName) {
      throw new ApiError(400, "user with this userName already exist");
    }
  
   
  
    //create a user object so that we can save all the data in our mongodb database
  
    const user = await User.create({
      fullName,
      userName: userName,
      email,
      password,
      avatar: avatar.url, //here we are taking url of avatar instead of using a file because with url we can access it thru cloudinary
      coverImage: coverImage?.url || "",
    });
  
    //after creating the user we have to remove the password and refreshToken
  
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
  
    //check if user is created or not
    if (!createdUser) {
      throw new ApiError(500, "There is some error while creating the object");
    }
  
    // after finishing all the steps now finally we have to return our response
  
    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
  });
  
  //login user algorithms and what are the steps we use :-
  //1 take data from req.body
  //2 check userName exist or not or correct or not
  //3 check for password if correct or not
  //4 generate access or refresh token
  //5 send tokens using cookies
  
  //4  using separate method to generate access and refresh tokens
  
  //1 making a wrap by a fxn loginuser with the help of asynchandler and taking user details from body using req.body
  const loginUser = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;
  
    console.log(userName);
  
    //2   checking if email or username is valid or correct or not as per rules
    if ( !userName) {              //!(email || userName)
      throw new ApiError(404, "userName  required");
    }
  
    //3   checking if user is already a registered user
    // 
    let user;
  
    // Checking if user exists based on email or userName
    if (userName)  {
      user = await User.findOne({ userName });
    }
    //console.log(user);
    if (!user) {
      throw new ApiError(404, "User does not exist , please sign up!");
    }
  
    //4 checking password is correct according to the bcrypt as it hashed it
    const isPasswordValid = await user.isPasswordCorrect(password);
  
    if (!isPasswordValid) {
      throw new ApiError(404, "password is wrong ");
    }
  
    // Generating access and refresh tokens using a method out side this fxn
  
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );
  
    //creating a variable named loggedinuser so that we can send the details to user without of password and refresh token
  
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
  
    //5  sending tokens using cookies and creting its options sending data thru json response!
  
    const options = {
      httpOnly: true,
      secure: true,
    };
  
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          201,
          {
            loggedInUser,
            accessToken,
            refreshToken,
          },
          "User Logged In Successfully!!"
        )
      );
  });
  
  //now creating the method for logout a user !!
  
  const loggedOutUser = asyncHandler(async (req, res) => {
    //using findbyidandupdate we can directly find and update at the same time by using a (new ) keyword to return the new value!!
    await User.findByIdAndUpdate(
      req.user._id,
      {
        // refreshToken : undefined
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );
    options = {
      httpOnly: true,
      secure: true,
    };
    //here we send response by clearing the cookies !!
  
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(201, {}, "user logged out successfully"));
  });
  
  //now here we will refresh our access and refresh tokens as for easy signing in !!
  
  //1   take the incoming refresh token from user/cookie/body
  
  const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
      req.cookie?.refreshToken || req.body.refreshToken;
  
    //check if the refresh token given by user is valid or not!!
    if (!incomingRefreshToken) {
      throw new ApiError(404, "unauthorised Token!!");
    }
    //now we will verify the refresh token of given user with the token(secret) stored in database!!
  
    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
  
      //now create a user instance by finding the user from db using this decodedtoken and with its id!!
      const user = await User.findById(decodedToken?._id);
  
      //check for user is valid , correct or not!!
      if (!user) {
        throw new ApiError(401, "invalid refresh token!!");
      }
  
      //now check or verify that the user provided refresh token is similar to the token that is stored in db then only we can give acces
  
      if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(404, "Refresh token provided is not matching!!");
      }
  
      //now if they both match then generate our tokens so that user can log in again
  
      const { accessToken, newRefreshToken } = generateAccessAndRefreshTokens(
        user?._id
      );
  
      options = {
        httpOnly: true,
        secure: true,
      };
  
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
          new ApiResponse(
            201,
            { accessToken, refreshToken: newRefreshToken },
            "Access Token Refreshed Successfully"
          )
        );
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid token refreshment!!");
    }
  });
  
  const changeCurrentPassword = asyncHandler(async (req, res) => {
    //1 taking passwords from body(frontend) thru req.body and destructuring it
  
    const { oldPassword, newPassword } = req.body;
  
    //now use User to retrieve user from db
    const user = await User.findById(req.user._id);
  
    //now check that the given oldpassword by user is equal to the password in db or not!!
    const isPasswordCorrect = await User.isPasswordCorrect(oldPassword);
  
    if (!isPasswordCorrect) {
      throw new ApiError(402, "Invalid old password");
    }
  
    //now we have access of db thru user and we  can change password and save it
  
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
  
    //return an response of successfully password changed
  
    return res
      .status(200)
      .json(new ApiResponse(201, {}, "Password Updated Successfully"));
  });
  
  //now if we want the details of current user then we can get it back using req.user
  
  const getCurrentUserDetails = asyncHandler(async (req, res) => {
    return res
      .status(200)
      .json(new ApiResponse(200, req.user, "current user fetched successfully"));
  });

  export {
    registerUser,
    loginUser,
    loggedOutUser,
    refreshAccessToken,
    changeCurrentPassword,
   getCurrentUserDetails,
   generateAccessAndRefreshTokens

  }