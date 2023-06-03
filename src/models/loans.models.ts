import mongoose from "mongoose";
const { Schema } = mongoose;

const loanSchema = new Schema({
  loanName: String,
  loanType: String,
  loanAmount: Number,
  loanIssueDate: Date,
  loanStatus: String,
});

const loanModel = mongoose.model("Loans", loanSchema);

export default loanModel;
