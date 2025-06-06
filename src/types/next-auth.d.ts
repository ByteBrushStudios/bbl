import { DefaultSession, DefaultJWT } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            isAdmin: boolean;
            isSuperAdmin: boolean;
            hasAllowedDomain: boolean;
        } & DefaultSession["user"];
    }

    interface User {
        role: Role;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id?: string;
        role?: string;
        isAdmin?: boolean;
        isSuperAdmin?: boolean;
        hasAllowedDomain?: boolean;
    }
}
