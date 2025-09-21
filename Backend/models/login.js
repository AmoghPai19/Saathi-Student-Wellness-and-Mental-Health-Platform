import mongoose from 'mongoose';

// The schema defines the structure for user login data.
const LoginSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['student', 'admin'], 
    required: true 
  }
});

// Changed model name from 'User' to 'Login' to match your filename.
// This will create a collection named 'logins' in your MongoDB database.
const Login = mongoose.model('Login', LoginSchema);

export default Login;