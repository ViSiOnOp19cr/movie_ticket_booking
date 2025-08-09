declare global {
    namespace Express {
        interface Request {
            userId?: number;
            userRole?: boolean;
        }
    }
}

export {};