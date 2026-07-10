import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadUser = async () => {

            const token = localStorage.getItem("token");

            if (!token) {

    setUser(null);

    setLoading(false);

    return;

}

            try {

                const data = await getMe();

                if (!data.detail) {
                    setUser(data);
                } else {
                    localStorage.removeItem("token");
                }

            } catch (err) {

                console.error(err);
                localStorage.removeItem("token");

            } finally {

                setLoading(false);

            }

        };

        loadUser();

    }, []);

    const logout = () => {

        localStorage.removeItem("token");
        setUser(null);

    };

    return (

        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export const useAuth = () => useContext(AuthContext);