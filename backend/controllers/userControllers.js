import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      number: user.number,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const mobileLogin = asyncHandler(async (req, res) => {
  const { mobile } = req.body;

  const user = await User.findOne({ number: mobile });

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      number: user.number,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid mobile number");
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      number: user.number,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.number = req.body.number || user.number;
    if(req.body.password){
      user.password = req.body.password;
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      number: updatedUser.number,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });

  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, number, password } = req.body;
const userExists = await User.findOne({email});

  if (userExists) {
    res.status(400)
    throw new Error('User already exits')
  }

  const user = await User.create({
    name,
    email,
    number,
    password
  })

  if(user){
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      number: user.number,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  }else{
    res.status(400)
    throw new Error('Invalid user data')
  }

});

//Admin controller
const getUsers = asyncHandler(async(req,res)=>{
  const users = await User.find({})
  res.json(users)
})

const deleteUser = asyncHandler(async(req,res)=>{
  const user = await User.findById(req.params.id)
  if(user){
    await user.remove()
    res.json({ message: 'User removed' })
  }else{
    res.status(404)
    throw new Error('User not found')
  }
})

const getUserById = asyncHandler(async(req,res)=>{
  const user = await User.findById(req.params.id).select('-password')
  if(user){
    res.json(user)
  }else{
    res.status(404)
    throw new Error('User not found')
  }
})

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.number = req.body.number || user.number;
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      number: updatedUser.number,
      isAdmin: updatedUser.isAdmin
    });

  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export { authUser, getUserProfile,registerUser,updateUserProfile, getUsers, deleteUser, getUserById, updateUser, mobileLogin };
