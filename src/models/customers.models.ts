import mongoose from "mongoose";
const { Schema } = mongoose;

const customerSchema = new Schema({
  firstName: String,
  lastName: String,
  emailAddress: String,
  phoneNumber: Number,
  dob: Date,
});

const customerModel = mongoose.model("Customer", customerSchema);

export default customerModel;
