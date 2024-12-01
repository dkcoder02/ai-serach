import mongoose, { Schema } from 'mongoose';

const searchSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SearchModel =
  mongoose.models.Search || mongoose.model('Search', searchSchema);

export default SearchModel;
