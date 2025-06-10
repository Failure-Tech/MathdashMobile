export type User = {
    id: string;
    email: string;
    username: string;
    rating?: number;
    matchesPlayed?: number;
    matchesWon?: number;
}

export type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, username: string) => Promise<void>;
    logout: () => Promise<void>;
}