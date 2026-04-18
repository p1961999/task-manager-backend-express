import mongoose, {Document, Types, Schema} from "mongoose";

export interface IRefreshToken extends Document{
    user: Types.ObjectId;
    token: string;
    expiresAt: Date;
}

const refreshTokenSchema =  new Schema<IRefreshToken>({
    user: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true,
        index: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt:{
        type: Date,
        required: true
    }
},
{timestamps: true}
);

refreshTokenSchema.index({expiresAt: 1},{expireAfterSeconds: 0});

export const RefreshToken = mongoose.model<IRefreshToken>(
    "RefreshToken",
    refreshTokenSchema
);