import { Link } from 'react-router-dom';
import logo from '../assets/image.png';
import { useUser, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
    const { isSignedIn, user } = useUser();

    return (
        <div className="flex items-center justify-between px-6 py-3 bg-white shadow-sm border-b border-gray-200">
            {/* Logo */}
            <Link to="/admin/dashboad" className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="h-12" />
                <span className="text-lg font-semibold text-gray-800 hidden md:inline">EliteTravel</span>
            </Link>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {isSignedIn ? (
                    <>
                        <span className="text-sm font-medium text-gray-700">
                            Hi, {user?.firstName || user?.username}
                        </span>

                        {/* Dùng UserButton của Clerk để hiện ảnh user và popup */}
                        <UserButton afterSignOutUrl="/admin" />
                    </>
                ) : (
                    <Link to="/admin">
                        <button className="px-4 py-2 text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 rounded-full transition duration-200">
                            Login
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
