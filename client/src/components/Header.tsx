import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import Login from '../components/Login';
import Register from './Register';

const Header = () => {
    const navLinks = [
        { name: 'Tìm du thuyền', path: '/cruise' },
        { name: 'Tìm khách sạn', path: '/' },
        { name: 'Tìm địa điểm du lịch', path: '/' },
        { name: 'Doanh nghiệp', path: '/' },
        { name: 'Blog', path: '/' },
    ];

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "shadow-md text-gray-700 backdrop-blur-lg py-1 md:py-1.5" : "py-0 md:py-0.5"}`}>
                <a href="/" className="flex items-center gap-2">
                    <img src={logo} alt="logo" className="h-20" />
                </a>

                <div className="hidden md:flex text-white items-center gap-4 lg:gap-8">
                    {navLinks.map((link, i) => (
                        <a key={i} href={link.path} className="group flex flex-col gap-0.5">
                            {link.name}
                        </a>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={() => setShowLogin(true)}
                        className="bg-black text-white px-8 py-2 rounded-full ml-4 transition-all duration-500"
                    >
                        Login
                    </button>
                </div>

                <div className="flex items-center gap-3 md:hidden">
                    <svg onClick={() => setIsMenuOpen(!isMenuOpen)} className={`h-6 w-6 cursor-pointer ${isScrolled ? "invert" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="4" y1="6" x2="20" y2="6" />
                        <line x1="4" y1="12" x2="20" y2="12" />
                        <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                </div>
            </nav>

            {/* Hiển thị login modal nếu showLogin true */}
            {showLogin && (
                <Login
                    onClose={() => setShowLogin(false)}
                    openRegister={() => {
                        setShowLogin(false);       // đóng form đăng nhập
                        setShowRegister(true);     // mở form đăng ký
                    }}
                />
            )}

            {showRegister && (
                <Register
                    onClose={() => setShowRegister(false)}
                    openLogin={() => {
                        setShowRegister(false);
                        setShowLogin(true);
                    }}
                />
            )}
        </>
    );
};

export default Header;
