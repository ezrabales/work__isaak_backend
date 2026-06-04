const emailjs = require("@emailjs/nodejs");
emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
});
const User = require("../models/user");

module.exports.sendEmailToEzra = async (req, res, next) => {
  try {
    const { message } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        fromEmail: user.email,
        from: "Plumbing Tech",
        message,
      },
    );

    res.status(200).send({
      message: "Email sent successfully",
    });
  } catch (err) {
    next(err);
  }
};
