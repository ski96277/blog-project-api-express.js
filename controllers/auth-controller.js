const appleSigninAuth = require("apple-signin-auth");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");

const User = require("../model/User");
const { createJwtToken,decodeToken } = require("../utils/jwt-token");
const { asyncHandler, ApiError } = require("../middleware/ErrorHandler");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerController = asyncHandler(async (req, res) => {
  const { name, email, password, profileImage } = req.body;

  if (!name || !email || !password) {
    throw new ApiError("name,email,password field is required", 400);
  }

  const isExits = await User.findOne({ email: email });
  if (isExits) {
    throw new ApiError("Already have an account with this email.", 400);
  }

  const user = await User.create({
    name: name,
    email: email,
    password: password,
    profileImage: profileImage,
  });

  const userObj = user.toObject();
  delete userObj.password;

  //create jwt
  const jwtToken = createJwtToken(
    userObj._id,
    userObj.email,
    userObj.role,
    userObj.provider
  );

  res.status(201).json({
    status: "Success",
    message: "Register success",
    data: userObj,
    jwtToken,
  });
});

const adminCreateController = asyncHandler(async (req, res) => {
  const { name, email, password, profileImage } = req.body;
  const authHeaders = req.headers.authorization;

  if(!authHeaders || !authHeaders.startsWith("Bearer ")){
    throw new ApiError("Unauthorized: No Token provided",401);
  }
  const token = authHeaders.split(" ")[1];

  //decode token 
  const tokenInfo = decodeToken(token);

  if(tokenInfo.role!="superadmin"){
    throw new ApiError("You are not authorize to create admin",401);
  }

  if (!name || !email || !password) {
    throw new ApiError("name,email,password field is required", 400);
  }

  const isExits = await User.findOne({ email: email });
  if (isExits) {
    throw new ApiError("Already have an account with this email.", 400);
  }

  const user = await User.create({
    name: name,
    email: email,
    password: password,
    profileImage: profileImage,
    role: "admin"
  });

  const userObj = user.toObject();
  delete userObj.password;

  //create jwt
  const jwtToken = createJwtToken(
    userObj._id,
    userObj.email,
    userObj.role,
    userObj.provider
  );

  res.status(201).json({
    status: "Success",
    message: "Register success",
    data: userObj,
    jwtToken,
  });
});

const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError("Email & Password are required.", 400);
  }

  const user = await User.findOne({ email: email });

  console.log("User found = " + !user);

  if (!user) {
    throw new ApiError("User doesn't exits with this credentials", 404);
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new ApiError("Invalid Password", 401);
  }

  const jwtToken = createJwtToken(user._id, user.email, user.role);

  const userObj = user.toObject();
  delete userObj.password;

  return res.status(200).json({
    status: "Success",
    message: "Login Success",
    jwtToken,
    data: userObj,
  });
});

const socialLoginController = asyncHandler(async (req, res) => {
  const { provider, idToken, accessToken } = req.body;

  if (!provider || (!idToken && !accessToken)) {
    throw new ApiError("Provider and token required", 400);
  }

  let userData = null;

  if (provider === "google") {
    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    userData = {
      provider: "google",
      providerId: payload.sub,
      name: payload.name,
      email: payload.email,
      profileImage: payload.picture,
    };
  } else if (provider === "facebook") {
    // Verify Facebook token and fetch user info
    const fbRes = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    userData = {
      provider: "facebook",
      providerId: fbRes.data.id,
      name: fbRes.data.name,
      email: fbRes.data.email,
      profileImage: fbRes.data.picture?.data?.url,
    };
  } else if (provider === "apple") {
    // Verify Apple identity token
    const appleData = await appleSigninAuth.verifyIdToken(idToken, {
      audience: process.env.APPLE_CLIENT_ID,
      ignoreExpiration: false,
    });

    userData = {
      provider: "apple",
      providerId: appleData.sub,
      name: "", // Apple sometimes doesn't provide name
      email: appleData.email,
      profileImage: "",
    };
  } else {
    throw new ApiError("Unsupported provider", 400);
  }

  if (!userData?.email) {
    throw new ApiError("No email found from social provider", 400);
  }

  let user = await User.findOne({ email: userData.email });

  if (!user) {
    // Create new user
    user = await User.create({
      name: userData.name || "Unknown",
      email: userData.email,
      provider: userData.provider,
      providerId: userData.providerId,
      profileImage: userData.profileImage,
    });
  } else {
    // Update provider info if user exists
    user.provider = userData.provider;
    user.providerId = userData.providerId;
    user.profileImage = userData.profileImage || user.profileImage;
    await user.save();
  }

  const userObj = user.toObject();
  delete userObj.password;

  const jwtToken = createJwtToken(userObj._id, userObj.email, userObj.role);

  return res.status(200).json({
    status: "Success",
    message: `${provider} login successful`,
    jwtToken,
    data: userObj,
  });
});

module.exports = { registerController, loginController, socialLoginController,adminCreateController };
