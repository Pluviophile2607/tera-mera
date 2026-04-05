import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    reporter: {
      type: String,
      required: true,
      trim: true,
    },
    karma: {
      type: Number,
      default: 0,
    },
    violation: {
      type: String,
      required: true,
      enum: ['Spam', 'Harassment', 'Harmful Content', 'Inappropriate'],
    },
    priority: {
      type: String,
      required: true,
      enum: ['High', 'Medium', 'Low'],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=100',
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'resolved', 'taken_down'],
    },
  },
  {
    timestamps: true,
  },
);

export const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
