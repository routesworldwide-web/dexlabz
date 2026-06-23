import {
  type HydratedDocument,
  type Model,
  model,
  models,
  Schema,
  type Types,
} from "mongoose";

export type AuthenticationCode = {
  _id: Types.ObjectId;
  code: string;
  assignedEmail?: string;
  batch?: string;
  expiresAt?: Date;
  usedAt?: Date;
  usedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthenticationCodeDocument =
  HydratedDocument<AuthenticationCode>;

const authenticationCodeSchema = new Schema<AuthenticationCode>(
  {
    code: {
      type: String,
      required: true,
      immutable: true,
      trim: true,
      minlength: 1,
      maxlength: 128,
    },
    assignedEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    batch: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    expiresAt: {
      type: Date,
    },
    usedAt: {
      type: Date,
    },
    usedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    collection: "authentication_codes",
    timestamps: true,
    versionKey: false,
  },
);

authenticationCodeSchema.index(
  { code: 1 },
  { name: "authentication_codes_code_unique", unique: true },
);
authenticationCodeSchema.index(
  { usedAt: 1, expiresAt: 1 },
  { name: "authentication_codes_availability" },
);

export const AuthenticationCodeModel =
  (models.AuthenticationCode as Model<AuthenticationCode> | undefined) ??
  model<AuthenticationCode>("AuthenticationCode", authenticationCodeSchema);
