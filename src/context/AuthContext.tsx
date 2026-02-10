import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type Student, getStudentByNISN } from '../data/mockData';

// User types
export type UserRole = 'student' | 'admin' | null;

interface AuthUser {
    role: UserRole;
    student?: Student;
    admin?: { username: string; name: string };
}

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    role: UserRole;
    login: (role: 'student' | 'admin', credentials: { nisn?: string; username?: string; password?: string }) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin credentials
const MOCK_ADMIN = {
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => {
        try {
            // Check localStorage for persisted auth
            const stored = localStorage.getItem('edupay_auth');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch {
            // localStorage not available or invalid JSON
        }
        return null;
    });

    const login = useCallback(async (
        role: 'student' | 'admin',
        credentials: { nisn?: string; username?: string; password?: string }
    ): Promise<boolean> => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (role === 'student' && credentials.nisn) {
            const student = getStudentByNISN(credentials.nisn);
            if (student) {
                const authUser: AuthUser = { role: 'student', student };
                setUser(authUser);
                localStorage.setItem('edupay_auth', JSON.stringify(authUser));
                return true;
            }
            return false;
        }

        if (role === 'admin' && credentials.username && credentials.password) {
            if (
                credentials.username === MOCK_ADMIN.username &&
                credentials.password === MOCK_ADMIN.password
            ) {
                const authUser: AuthUser = {
                    role: 'admin',
                    admin: { username: MOCK_ADMIN.username, name: MOCK_ADMIN.name },
                };
                setUser(authUser);
                localStorage.setItem('edupay_auth', JSON.stringify(authUser));
                return true;
            }
            return false;
        }

        return false;
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('edupay_auth');
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: user !== null,
                role: user?.role ?? null,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
