import { Request, Response } from "express";
import { TUser } from "../types/userTypes";

import * as authServices from "../services/userServices";

export async function signUp(req: Request, res: Response) {
    const user: TUser = {
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
    };
    const confirmPassword: string = req.body.confirmPassword;

    authServices.validateConfirmPassword(user.password, confirmPassword);
    await authServices.validateNewEmail(user.email);
    const createdUser = await authServices.insertUser(user);

    res.status(201).send(createdUser);
}

export async function signIn(req: Request, res: Response) {
    const user: TUser = req.body;

    await authServices.validatePassword(user);
    const token: string = await authServices.generateToken(user.email);

    res.status(200).send({ token });
}