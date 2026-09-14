import mongoose, { type Model, type Schema, type Types } from "mongoose"

export interface ICryptoWallet extends mongoose.Document {
  _id: Types.ObjectId
  asset: string
  name: string
  symbol: string
  network: string
  address: string
  qrCodeUrl?: string
  minDeposit?: number
  depositFee?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const cryptoWalletSchema: Schema<ICryptoWallet> = new mongoose.Schema(
  {
    asset: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    symbol: { type: String, required: true, trim: true },
    network: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    qrCodeUrl: { type: String, default: "" },
    minDeposit: { type: Number, default: 0, min: 0 },
    depositFee: { type: String, default: "0.00%" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const CryptoWallet: Model<ICryptoWallet> =
  mongoose.models.CryptoWallet ||
  mongoose.model<ICryptoWallet>("CryptoWallet", cryptoWalletSchema)
