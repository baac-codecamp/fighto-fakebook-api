const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const guideSchema = Schema({
  
  password: { type: String, required: true, trim: true , minlength: 3 },
  firstname:  { type: String, required: true, trim: true },
  lastname:  { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true, index: true },
  gender:  { type: String, required: true, trim: true },
  address:  { type: String, required: true, trim: true },
  education:  { type: String, required: true, trim: true },
  displayname:  { type: String, required: true, trim: true },
  datecreate : {type: String, required: true, trim: true }
},{
  collection: 'users'
});

guideSchema.methods.encryptPassword = async (password)  => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
}

guideSchema.methods.comparePassword = async function (password)  {
  console.log(password);
  console.log(this.password);
  const isValid = await bcrypt.compare(password, this.password);
  return isValid;
}
  
  const guide = mongoose.model('Guide', guideSchema);
  
  module.exports = guide;