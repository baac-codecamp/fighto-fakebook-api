const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const guideSchema = Schema({
  name:  { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true, index: true },
  password: { type: String, required: true, trim: true , minlength: 3 },
  role: { type: String, default: 'member' }
},{
  collection: 'guides'
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