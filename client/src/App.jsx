import { useEffect } from 'react'
import Routes from './pages/Routes'
import { useLocation } from "react-router-dom";
import { useAuthContext } from './contexts/AuthContext'
import Loader from './components/Loader'
import { useSellerAuthContext } from './contexts/SellerAuthContext'
import "aos/dist/aos.css";
import AOS from "aos";


export default function App() {
    const { loading } = useAuthContext()
    const { loading: sellerLoading } = useSellerAuthContext()
    useEffect(() => { AOS.init({ duration: 700, easing: "ease-out-cubic", once: true, offset: 80, }) }, []);

    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0) }, [pathname]);
    return (
        <div className='overflow-Fx-hidden'>
            {loading || sellerLoading ? <Loader /> : <Routes />}
        </div>
    )
}