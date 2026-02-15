const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: String,
  body: { type: String, required: true },
  tags: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  state: { type: String, enum: ['draft', 'published'], default: 'draft' },
  read_count: { type: Number, default: 0 },
  reading_time: Number
}, { timestamps: true });

// Calculate reading time before save
blogSchema.pre('save', function() {
  const wordsPerMinute = 200;
  const wordCount = this.body.split(/\s+/).length;
  this.reading_time = Math.ceil(wordCount / wordsPerMinute);
//   next();
});

// const calculateReadingTime = require("../utils/calculateReadingTime");

// blogSchema.pre("save", function () {
//   if (this.body) {
//     this.reading_time = calculateReadingTime(this.body);
//   }
//   next();
// });


module.exports = mongoose.model('Blog', blogSchema);
