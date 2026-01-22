import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (location.pathname === '/' && path === '/') return true;
    if (path === '/') return false;
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { path: '/', label: 'Beranda' },
    { path: '/webgis', label: 'WebGIS' },
    { path: '/spesies-karbon', label: 'Spesies & Karbon' },
    { path: '/dokumen', label: 'Dokumen' },
    { path: '/tentang', label: 'Tentang' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-xl sticky top-0 z-50 border-b border-teal-500/20">
        <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-8 lg:px-12">
          <div className="flex justify-between h-20">
            {/* Logo & Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-4 group">
                {/* Logo Custom - Ganti icon SVG dengan image */}
                <div className="relative w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src="/logo.png" 
                    alt="Logo WebGIS Srinanti"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback jika logo.png tidak ditemukan
                      console.warn('Logo tidak ditemukan, menggunakan fallback icon');
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling;
                      if (fallback) (fallback as HTMLElement).style.display = 'flex';
                    }}
                  />
                  {/* Fallback Icon (hidden by default) */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ display: 'none' }}
                  >
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
                    SPACEMANGROVE
                  </h1>
                  <p className="text-xs text-slate-400 tracking-wide">Sistem Informasi Geografis Desa Srinanti</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-6 py-2.5 rounded-xl font-medium text-sm tracking-wide transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg shadow-teal-500/30'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-teal-400 p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700 bg-slate-900">
            <div className="px-4 py-3 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-medium text-sm tracking-wide transition-all ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-12 border-t border-teal-500/20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/logo.png" 
                  alt="Logo"
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <h3 className="text-xl font-bold text-teal-400">SPACEMANGROVE</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Platform Sistem Informasi Geografis untuk pemetaan dan pengelolaan data spasial Desa Srinanti.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-teal-400">Tautan Cepat</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path}
                      className="text-slate-300 hover:text-teal-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-teal-400">Kontak</h3>
              <div className="space-y-2 text-sm text-slate-300">
                <p>Desa Srinanti</p>
                <p>Kabupaten, Provinsi</p>
                <p>Email: info@srinanti.desa.id</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} WebGIS Desa Srinanti. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;