import { User } from "@prisma/client";

declare module "express" {
    interface Request {
        loggedUser?: User,
    }
}