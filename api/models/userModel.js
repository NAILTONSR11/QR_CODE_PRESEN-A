import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  matricula: { type: String, required: true, unique: true },
  nome: { type: String, required: true },
  setor: { type: String, required: true },
  email: { type: String, required: true },
  casa: { type: String, required: true },

  status: {
    type: String,
    enum: ["nao", "confirmado", "presente"],
    default: "nao"
  },

  qrcode: {
    type: String,
    default: ""
  },

  horaPresenca: {
    type: Date,
    default: null
  }
});

export default mongoose.model("User", userSchema);
