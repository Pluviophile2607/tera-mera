import mongoose from 'mongoose';

const claimRequestSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'approved', 'rejected'],
    },
  },
  {
    timestamps: true,
  },
);

// Ensure a user can only request an item once
claimRequestSchema.index({ listingId: 1, userId: 1 }, { unique: true });

export const ClaimRequest = mongoose.models.ClaimRequest || mongoose.model('ClaimRequest', claimRequestSchema);
