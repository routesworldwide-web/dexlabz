import {
  type HydratedDocument,
  type Model,
  model,
  models,
  Schema,
  type Types,
} from "mongoose";

export type User = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  mobile: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserDocument = HydratedDocument<User>;

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      maxlength: 20,
    },
  },
  {
    collection: "users",
    timestamps: true,
    versionKey: false,
  },
);

userSchema.index({ email: 1 }, { name: "users_email_unique", unique: true });

export const UserModel =
  (models.User as Model<User> | undefined) ?? model<User>("User", userSchema);
