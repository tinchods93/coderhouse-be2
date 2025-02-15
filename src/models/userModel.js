import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: false,
  },
  last_name: {
    type: String,
    required: false,
  },
  age: {
    type: Number,
    required: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: 'user',
    required: false,
  },
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
