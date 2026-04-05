import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Tools', 'Home & Decor', 'Garden', 'Kitchen', 'Electronics'],
    },
    condition: {
      type: String,
      required: true,
      enum: ['Brand New', 'Good as New', 'Well-loved', 'Vintage/Relic'],
    },
    type: {
      type: String,
      required: true,
      enum: ['Gift', 'Lend', 'Sell', 'Request'],
    },
    price: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      required: true,
    },
    radius: {
      type: Number,
      default: 5,
    },
    images: [{
      type: String,
    }],
    urgency: {
      type: String,
      enum: ['Today', 'This Week', 'Anytime'],
      default: 'Anytime',
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'available', 'claimed', 'rejected', 'hidden'],
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);
