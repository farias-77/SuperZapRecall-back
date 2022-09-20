import { prisma } from "../config/database";
import { Users } from "@prisma/client";
import { TUser } from "../types/userTypes";

export async function findByEmail(email: string): Promise<Users | null>{
    return await prisma.users.findFirst({
        where:{
            email
        }
    });
}

export async function insertUser(user: TUser): Promise<Users> {
    const createdUser: Users = await prisma.users.create({
        data: user
    });

    return createdUser;
}