import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

type SidebarLink = {
    name: string;
    path?: string;
    icon?: string;
    children?: { name: string; path: string; icon?: string }[];
};

const Sidebar = () => {
    const location = useLocation();
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
    const [collapsed, setCollapsed] = useState<boolean>(false);

    const toggleMenu = (index: number) => {
        setOpenMenuIndex(prevIndex => (prevIndex === index ? null : index));
    };

    const sidebarLinks: SidebarLink[] = [
        { name: 'Hệ Thống', path: '/admin/dashboad', icon: '💻' },
        {
            name: 'Các Chuyến Tham Quan',
            icon: '🧭',
            children: [
                { name: 'Danh sách Các Chuyến Tham Quan', path: '/admin/list-tour', icon: '📋' },
                { name: 'Thêm Các Chuyến Tham Quan', path: '/admin/add-tour', icon: '🆕' },
            ],
        },
        {
            name: 'Lịch Trình Các Chuyến Tham Quan',
            icon: '🗓️',
            children: [
                { name: 'Danh sách Lịch Trình Các Chuyến Tham Quan', path: '/admin/list-tourschedule', icon: '📅' },
                { name: 'Thêm Lịch Trình Các Chuyến Tham Quan', path: '/admin/add-tourschedule', icon: '✍️' },
            ],
        },
        {
            name: 'Phòng',
            icon: '🏨',
            children: [
                { name: 'Danh sách phòng', path: '/admin/list-room', icon: '📋' },
                { name: 'Thêm phòng', path: '/admin/add-room', icon: '➕' },
            ],
        },
        {
            name: 'Phương Tiện',
            icon: '🚌',
            children: [
                { name: 'Danh sách chuyến', path: '/admin/list-transport', icon: '📃' },
                { name: 'Thêm chuyến', path: '/admin/add-transport', icon: '🛠️' },
            ],
        },
        {
            name: 'Lịch trình vận chuyển',
            icon: '🛣️',
            children: [
                { name: 'Danh sách Lịch trình', path: '/admin/list-Transport_Schedule', icon: '📝' },
                { name: 'Thêm Lịch trình', path: '/admin/add-Transport_Schedule', icon: '🆕' },
            ],
        },
    ];

    return (
        <div
            className={`h-screen bg-white text-black transition-all duration-300 ease-in-out 
            ${collapsed ? 'w-20' : 'w-72'} flex flex-col shadow-lg`}
        >
            <div className="p-3 flex justify-end">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-black hover:scale-110 transform duration-200"
                    title="Toggle Sidebar"
                >
                    {collapsed ? '➡️' : '⬅️'}
                </button>
            </div>

            {/* Phần menu scrollable */}
            <nav
                className="flex flex-col gap-1 px-2 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
                style={{ maxHeight: 'calc(100vh - 86px)', scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
            >
                {sidebarLinks.map((link, index) => (
                    <div key={index}>
                        {link.children ? (
                            <div
                                onClick={() => toggleMenu(index)}
                                className={`flex items-center justify-between gap-3 px-3 py-2 cursor-pointer rounded-lg transition-all
                                    hover:bg-white/10 ${openMenuIndex === index ? 'bg-white/10 font-semibold' : ''}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{link.icon}</span>
                                    {!collapsed && <span>{link.name}</span>}
                                </div>
                                {!collapsed && (
                                    <span className="text-sm">{openMenuIndex === index ? '▲' : '▼'}</span>
                                )}
                            </div>
                        ) : (
                            link.path && (
                                <Link
                                    to={link.path}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                                        hover:bg-white/10 ${location.pathname === link.path ? 'bg-white/20 font-semibold' : ''}`}
                                >
                                    <span className="text-lg">{link.icon}</span>
                                    {!collapsed && <span>{link.name}</span>}
                                </Link>
                            )
                        )}

                        {link.children && openMenuIndex === index && (
                            <div className="ml-8 flex flex-col gap-1 mt-1">
                                {link.children.map((child, childIndex) => (
                                    <Link
                                        key={childIndex}
                                        to={child.path}
                                        className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-all
                                            hover:bg-white/10 ${location.pathname === child.path
                                                ? 'bg-white/20 text-red-600 font-semibold'
                                                : ''}`}
                                    >
                                        <span>{child.icon}</span>
                                        {!collapsed && <span>{child.name}</span>}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
