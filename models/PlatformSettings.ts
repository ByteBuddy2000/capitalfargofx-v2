// models/PlatformSettings.ts
import mongoose, { type Model, type Schema, type Types } from "mongoose"

export interface IPlatformSettings extends mongoose.Document {
  _id: Types.ObjectId
  platformName?: string
  siteName?: string
  supportEmail: string
  telegramChannel: string
  companyAddress?: string
  minWithdrawalAmount?: number
  maxWithdrawalDaily?: number
  withdrawalFeePercentage?: number
  activeInvestorsDisplay?: string
  statsActiveInvestors?: string
  totalDepositsDisplay?: string
  statsTotalDeposited?: string
  totalWithdrawalsDisplay?: string
  statsTotalWithdrawn?: string
  supportedAssetsDisplay?: string
  statsCountriesSupported?: string
  maintenanceMode?: boolean
  isMaintenanceMode?: boolean
  createdAt: Date
  updatedAt: Date
}

const platformSettingsSchema: Schema<IPlatformSettings> = new mongoose.Schema(
  {
    platformName: String,
    siteName: String,
    supportEmail: { type: String, required: true },
    telegramChannel: { type: String, required: true },
    companyAddress: String,
    minWithdrawalAmount: Number,
    maxWithdrawalDaily: Number,
    withdrawalFeePercentage: Number,
    activeInvestorsDisplay: String,
    statsActiveInvestors: String,
    totalDepositsDisplay: String,
    statsTotalDeposited: String,
    totalWithdrawalsDisplay: String,
    statsTotalWithdrawn: String,
    supportedAssetsDisplay: String,
    statsCountriesSupported: String,
    maintenanceMode: Boolean,
    isMaintenanceMode: Boolean,
  },
  { timestamps: true }
)

export const PlatformSettings: Model<IPlatformSettings> =
  mongoose.models.PlatformSettings ||
  mongoose.model<IPlatformSettings>("PlatformSettings", platformSettingsSchema)
