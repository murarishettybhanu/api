const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user.model");
const express = require("express");
const router = express.Router();

router.post("/register", async (req, res) => {
  // validate the request body first
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //find an existing user
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    role: req.body.role
  });
  user.password = await bcrypt.hash(user.password, 10);
  await user.save((error, done) => {
    if (!error) {
      res.send("Successfully Registered")
    }
  });
});

router.post("/login", async (req, res) => {

  let user = await User.findOne({ email: req.body.email });
  if (user && bcrypt.compareSync(req.body.password, user.password)) {

    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send({
      _id: user._id,
      name: user.name,
      email: user.email.Router,
      role: user.role
    });

  }
  else {
    res.send("incorrect email or password")
  }

})

module.exports = router;
