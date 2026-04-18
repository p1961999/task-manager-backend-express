import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { RefreshToken } from "../models/refresh-token.model";

export const registerUser = async(data:{
    name: string;email:string;password: string
})=>{
    const exitingUser = await User.findOne({email: data.email});

    if(exitingUser){
        throw new ApiError(StatusCodes.CONFLICT, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password,10);
    const user = await User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword
    });

    return{
        id: user._id,
        name: user.name,
        email: user.email
    };
};

export const loginUser = async(data:{
    email:string;password: string
})=>{
    const user = await User.findOne({email: data.email});

    if(!user){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid Credentials");
    }

    const isCorrectPassword = await bcrypt.compare(data.password,user.password);

    if(!isCorrectPassword){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid Credentials");
    }

    const payload = {
        userId: user._id.toString(),
        email: user.email
    };

    const authAccessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate()+7);

    await RefreshToken.create({
        user: user._id,
        token: refreshToken,
        expiresAt
    });

    return{
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        authAccessToken,
        refreshToken
    };
};

export const logoutUser = async(refreshToken: string)=>{
    await RefreshToken.findOneAndDelete({token: refreshToken});
}

export const refreshUserToken = async(refreshToken: string)=>{
    const storedToken = await RefreshToken.findOne({token: refreshToken});

    if(!storedToken){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }
    const payload = verifyRefreshToken(refreshToken);

    const authAccessToken = signAccessToken({
        userId: payload.userId,
        email: payload.email
    });

    return {authAccessToken};
};