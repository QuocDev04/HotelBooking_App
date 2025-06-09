import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

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

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full text-white flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "shadow-md text-gray-700 backdrop-blur-lg py-1 md:py-1.5" : "py-0 md:py-0.5"}`}>


            <a href="/" className="flex items-center gap-2">
                <img src={logo} alt="logo" className="h-20" />
            </a>
            <div className="hidden md:flex text-white items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <a key={i} href={link.path} className="group flex flex-col gap-0.5 text-white ">
                        {link.name}
                    </a>
                ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
                <button className="bg-black text-white px-8 py-2 rounded-full ml-4 transition-all duration-500">
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

            <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {navLinks.map((link, i) => (
                    <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
                        {link.name}
                    </a>
                ))}

                <button className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500">
                    Login
                </button>
            </div>
        </nav>
    );
};

export default Header;
