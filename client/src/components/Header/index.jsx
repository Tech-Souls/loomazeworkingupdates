import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { BiX } from "react-icons/bi";
import { useUserAuthContext } from '@/contexts/UserAuthContext';


const NAV_LINKS = [{ label: 'About', path: '/about-us' }, { label: 'Pricing', path: '/pricing' }, { label: 'Contact', path: '/contact-us' }, { label: 'Referral', path: '/referral' }, { label: 'Seller Account', path: '/join-as-seller' },];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuth, user } = useUserAuthContext();
  const closeMenu = () => setIsOpen(false);

  const AuthButtons = ({ mobile = false }) => (
    <div className={`flex ${mobile ? 'flex-col' : 'items-center'} gap-4`}>
      {isAuth ? (
        <Link to={user?.role === "admin" ? "/admin/dashboard" : "/user/profile"} className="bg-primary text-white px-5 py-2 rounded text-sm font-semibold hover:bg-opacity-80 transition" onClick={closeMenu}>
          {user?.role === "admin" ? "Admin" : "Dashboard"}
        </Link>
      ) : (
        <>
          <Link to="/auth/user/login" className="text-primary font-bold px-4" onClick={closeMenu}>Login</Link>
          <Link to="/auth/user/signup" className="bg-primary text-white px-6 py-2 rounded font-bold hover:bg-opacity-80 transition" onClick={closeMenu}>Signup</Link>
        </>
      )}
    </div>
  );

  return (
    <header className="flex justify-between items-center px-6 py-4 lg:px-20 border-b border-gray-200 sticky top-0 bg-white z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo/logo.png" alt="loomaze logo" className="h-10 sm:h-12 md:h-14" />
      </Link>

      {/* Desktop */}
      <nav className="hidden lg:flex items-center gap-8">
        <ul className="flex gap-6 font-medium text-gray-700">
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className="hover:text-primary transition-colors font-semibold"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <AuthButtons />
      </nav>

      {/* Mobile button */}
      <div className="lg:hidden flex items-center gap-4">
        {!isAuth && (
          <Link to="/contact-us" className="text-xs bg-primary text-white px-3 py-1.5 rounded">
            Contact Us
          </Link>
        )}
        <button onClick={() => setIsOpen(true)} aria-label="Open Menu">
          <HiOutlineMenuAlt3 size={28} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-white p-6 z-[60] transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-end mb-8">
          <button onClick={closeMenu} aria-label="Close Menu">
            <BiX size={32} />
          </button>
        </div>

        <nav className="flex flex-col gap-6 text-center text-lg font-semibold">
          {NAV_LINKS.map((link) => (
            <Link key={link.path} to={link.path} onClick={closeMenu} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
          <hr className="my-2" />
          <AuthButtons mobile />
        </nav>
      </div>
    </header>
  )
}