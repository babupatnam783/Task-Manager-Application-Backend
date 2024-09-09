const mongoose = require('mongoose')

const google_user_Schema = mongoose.Schema(
    {
        FirstName:{ type: String, required: true, },
        LastName:{ type: String, required: true, },
        Email: { type: String, required: true, unique: true },
        token:{type: String, required: true,}
    },
    {
      versionKey: false
    }
  );
  
  const googleUserModel = mongoose.model('GOOGLE_USER_DETAILS', google_user_Schema);
  
  module.exports = { googleUserModel };