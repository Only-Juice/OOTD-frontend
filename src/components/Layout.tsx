import React, { useEffect } from "react";
import NavBar from "./NavBar";
import Login from "./Login";
import { useQueryClient } from '@tanstack/react-query';
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import Bottombar from "./Bottombar.tsx";

interface LayoutProps {
    isModalOpen: boolean | undefined;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    theme: 'light' | 'dark';
    setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
    isPendingUserInfo: boolean;
    dataUserInfo: any;
    refetchUserInfo: () => void;
}

const Layout: React.FC<LayoutProps> = ({ isModalOpen, setIsModalOpen, theme, setTheme, isPendingUserInfo, dataUserInfo, refetchUserInfo }) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        // Automatically detect browser theme
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(prefersDarkScheme ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', prefersDarkScheme ? 'dark' : 'light');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('token_expiration');
        queryClient.invalidateQueries();
    };

    const requiredLoginPaths = ['/cart', '/cartresult', '/user', '/admin'];

    useEffect(() => {
        if (isModalOpen === undefined) return;
        if (isModalOpen) {
            handleLogout();
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            if (requiredLoginPaths.includes(window.location.pathname)) {
                setIsModalOpen(true);
            }
        }
    }, [localStorage, localStorage.getItem('token')]);

    return (
        <>
            <header>
                <NavBar
                    theme={theme}
                    setIsModalOpen={setIsModalOpen}
                    toggleTheme={toggleTheme}
                    handleLogout={handleLogout}
                    isPendingUserInfo={isPendingUserInfo}
                    dataUserInfo={dataUserInfo}
                    refetchUserInfo={refetchUserInfo}
                />
            </header>
            <main>
                <Container>
                    <Outlet />
                    <Login
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        refetchUserInfo={refetchUserInfo}
                        dataUserInfo={dataUserInfo}
                    />
                </Container>
            </main>
            <footer>
                <Bottombar />
            </footer>
        </>
    );
};

export default Layout;