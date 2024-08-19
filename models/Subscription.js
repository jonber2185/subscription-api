import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    name: { 
      type: String,
      maxLength: 20,
      required: true,
    },
    price: { 
      type: Number,
      min: [0, "price는 0원 이상이여야 합니다."],
      required: true,
    },
    cycle: { 
      type: String, 
      enum: ['m', 'y'],
      required: true,
    },
    firstPaymentDate: { 
      type: Date,
      required: true,
    },
    memo: { 
      type: String, 
    },
  }, {
    timestamps: true,
  }
);

const Subscription = mongoose.models['Subscription'] || mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;