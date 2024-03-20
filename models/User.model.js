import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
    //here we did not used the arrow fxns because we cannot access this in arrow functions and here pre is a hook used to encrypt
    if (!this.isModified("password")) return next(); // our password after some modification in it or at the time of registration just before saving it and we used next() middleware
    // just to go on next task.
  
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
  // here we use methods to use some methods to check wether the password is correct or not
  
  userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
  };


  
export const User = mongoose.model("User", userSchema);
