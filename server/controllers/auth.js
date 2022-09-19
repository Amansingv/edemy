import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";

module.exports.register = async (req, res) => {
  try {
    // console.log(req.body);
    const { name, email, password } = req.body;
    //validation
    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6)
      return res
        .status(400)
        .send("Password is required and should be 6 characters long");

    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("Email or password is wrong.");

    // hash password
    const hashedPassword = await hashPassword(password);

    //register
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    console.log("saved user : ", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error try again.");
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();

    if (!user) return res.status(400).send("No user found");
    //check password
    const match = await comparePassword(password, user.password);
    //create signed jwt
    let token;

    token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    //return user and token to client
    user.password = undefined;
    //send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, //only works on https
    });
    //send user as json response
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error! try again");
  }
};
