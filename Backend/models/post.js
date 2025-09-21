import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true }
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // CHANGED: Now an array of user IDs
  category: { type: String, required: true },
  isAnonymous: { type: Boolean, default: true },
  replies: [replySchema]
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post;