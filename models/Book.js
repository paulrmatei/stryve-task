import mongoose from 'mongoose';
const { Schema } = mongoose;

const bookSchema = new Schema({
  title: { type: String, required: 'Title is required' },
  author: String,
  rating: Number,
});

export default mongoose.model('Book', bookSchema);
