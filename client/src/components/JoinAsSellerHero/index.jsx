import { useNavigate } from "react-router-dom";
import { FaShop, FaUserCheck, FaWallet } from "react-icons/fa6";

export default function JoinAsSellerHero() {
    const navigate = useNavigate();

    return (
        <>
            <section className="relative min-h-[70vh] grid place-items-center join-as-seller-hero">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
                <div className="main-container relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 px-4 sm:px-8 items-center">
                    <div className="grid gap-4 text-white max-w-[600px] py-7">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl">Selling on loomaze is Easy!</h1>
                        <p>Got an established offline store that you want to move online, or just have a passion for selling products online?</p>
                        <p>Well, here’s how to take that next step with us</p>
                        <p>All you will need is:</p>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>Legal Shop Details</li>
                            <li>Your Business Details</li>
                            <li>Business Bank Account Details</li>
                        </ul>
                    </div>

                    <div className="bg-[#F3F4F4] rounded-md p-6 sm:p-8 grid gap-4 text-center w-full max-w-md mx-auto my-2">
                        <div>
                            <p className="font-bold text-sm">Grow your business online and</p>
                            <h2 className="text-lg">Simply<span className="text-primary font-bold"> Start Selling </span>Here By</h2>
                        </div>
                        <button onClick={() => navigate("/auth/seller/signup")} className="bg-primary text-white py-2 rounded font-bold transition hover:bg-primary/80">
                            Register now
                        </button>
                        <p>OR</p>
                        <button onClick={() => navigate("/auth/seller/login")} className="border border-primary text-primary py-2 rounded font-bold transition hover:bg-primary hover:text-white">
                            Login with existing account
                        </button>
                    </div>
                </div>
            </section>
            <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16 grid gap-12 text-center">
                <h1 className="text-2xl sm:text-3xl text-gray-900">Become a Seller on loomaze in 3 easy steps</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="grid gap-3 place-items-center">
                        <div className="w-24 h-24 rounded-full border grid place-items-center">
                            <FaUserCheck className="text-3xl text-primary" />
                        </div>
                        <h3 className="text-lg">Create Account</h3>
                        <p>Add your email and business details to get started selling on loomaze.</p>
                    </div>
                    <div className="grid gap-3 place-items-center">
                        <div className="w-24 h-24 rounded-full border grid place-items-center">
                            <FaShop className="text-3xl text-primary" />
                        </div>
                        <h3 className="text-lg">Add Business</h3>
                        <p>Add name, address & e-mail of your company, store/ business.</p>
                    </div>
                    <div className="grid gap-3 place-items-center">
                        <div className="w-24 h-24 rounded-full border grid place-items-center">
                            <FaWallet className="text-3xl text-primary" />
                        </div>
                        <h3 className="text-lg">Add Products/ Services</h3>
                        <p>Minimum 3 products/ services needed for your free listing page.</p>
                    </div>
                </div>
            </section>
        </>
    );
}