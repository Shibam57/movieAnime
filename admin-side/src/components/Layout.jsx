import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
export default function Layout() { const [menu, setMenu] = useState(false); return <div className="min-h-screen bg-slate-100"><Navbar menuOpen={menu} onMenu={() => setMenu(v => !v)}/><div className="md:flex min-h-[calc(100vh-64px)]"><aside className={`${menu ? 'block' : 'hidden'} md:block md:w-56 shrink-0`}><Sidebar onNavigate={() => setMenu(false)}/></aside><main className="min-w-0 flex-1 p-4 sm:p-6"><Outlet /></main></div></div>; }
