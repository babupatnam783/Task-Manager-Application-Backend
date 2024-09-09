const express = require("express");
const googleAuthenticationRoute = express.Router();
const { OAuth2Client } = require("google-auth-library");
const { googleUserModel } = require('../../model/auth/google_user_model');
const CLIENT_ID =
  "283376049531-p0trmjr4orngderp65c0fkeu6v72kun8.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

googleAuthenticationRoute.post("/google", async (req, res) => {
  const { idToken,displayName,email,emailVerified } = req.body;
  try {
      if (emailVerified) {
          const userExist = await googleUserModel.findOne({ Email: email });
          if (userExist) {
              await googleUserModel.updateOne({ Email: email }, { token: idToken })
              return res.status(200).json({ message: "User authenticated", token: idToken });
          } else {
              const googleUser = new googleUserModel({
                  "FirstName": displayName.split(" ")[0],
                  "LastName": displayName.split(" ")[1],
                  "Email": email,
                  "token": idToken,
              })
              await googleUser.save();
              return res.status(200).json({ message: "User authenticated", token: idToken });
          }
      }
    // Verify the ID token
    // const ticket = await client.verifyIdToken({
    //     idToken: idToken,
    //     audience: CLIENT_ID,
    //   });
    //   const payload = ticket.getPayload();
    //   const userId = payload['sub']; // Google user ID
    //   const userEmail = payload['email'];
    // res.status(200).json({ message: "User authenticated", token: idToken });
  } catch (error) {
    console.error("Error verifying ID token: ", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
});

module.exports = { googleAuthenticationRoute };
