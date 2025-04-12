const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { User, validateUpdateUser } = require("../models/user");
const {
  verifyTokenAndAuthorizaton,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
/**
 * @desc  Update User
 * @route /api/user:id
 * @method put
 * @access private
 *
 **/
router.put("/:id", verifyTokenAndAuthorizaton, async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }
  //   hash password if updated
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const UpdatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      },
    },
    { new: true }
  ).select("-password");
  res.status(200).json(UpdatedUser);
});

/**
 * @desc  Get All Users
 * @route /api/user
 * @method get
 * @access private (only admin)
 *
 **/

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const AllUsers = await User.find().select("-password");
    res.status(200).json(AllUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
/**
 * @desc  Get User by id
 * @route /api/user/:id
 * @method get
 * @access private (only user and admin) 
 *
 **/
router.get("/:id", verifyTokenAndAuthorizaton, async (req, res) => {
  // Validate ObjectId before querying
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }
  // 
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User Was Not Found" });
  } else {
    return res.status(200).json(user);
  }
});

/**
 * @desc  Delete User 
 * @route /api/user/:id
 * @method get
 * @access private (only user and admin) 
 *
 **/

router.delete("/:id",verifyTokenAndAuthorizaton,async(req,res)=>{
  // Validate ObjectId before querying
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }
  // 
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User Was Not Found" });
  } else {
    return res.status(200).json({message: `deleted user : ${user}`});
  }
})
module.exports = router;
