const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// criptografa a senha do usuári o automaticamnete
UserSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) next();

  this.password = await bcrypt.hash(this.password, 8);
});

UserSchema.methods = {
  // compara se a senha do usuário esta valida
  compareHash(hash) {
    return bcrypt.compare(hash, this.password);
  },

  // gera o JWT
  generateToken() {
    return jwt.sign({ id: this.id }, "secret", {
      expiresIn: 86400
    });
  }
};

mongoose.model("User", UserSchema);
