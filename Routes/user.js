const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User, validateUpdateUser } = require("../models/user");
const { verifyToken } = require("../middlewares/verifyToken");
/**
 * @desc  Update User
 * @route /api/user:id
 * @method put
 * @access private
 *
 **/
router.put("/:id",verifyToken, async (req, res) => {

    // fix the borken access
    if(req.user.id !== req.params.id){
        return res.status(403).json({message: "unotherised access"})
    }
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

module.exports = router;
