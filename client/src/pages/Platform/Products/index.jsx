import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import ProductBox from "../../../components/ProductBox";
import ProductBoxTwo from "../../../components/ProductBoxTwo";
import axios from "axios";
import ProductBoxThree from "../../../components/ProductBoxThree";
import ProductBoxJewellery from "../../../components/ProductBoxJewellery";
import ProductBoxFashion from "../../../components/ProductBoxFashion";

export default function ProductsPage({ settings, isCustomDomain }) {
    
    const style = settings?.layout?.homePageStyle
    
    const productBoxComponents = {
        style1: ProductBox,
        style2: ProductBoxTwo,
        style3: ProductBoxThree,
        jewellery: ProductBoxJewellery,
        fashion: ProductBoxFashion
    };

    const ProductBoxComponent = productBoxComponents[style] || null;

    const [searchParams] = useSearchParams();
    const urlPage = parseInt(searchParams.get("page")) || 1;
    const urlSubCategory = searchParams.get("subcategory") || null;
    const urlMinPrice = searchParams.get("minPrice") || "";
    const urlMaxPrice = searchParams.get("maxPrice") || "";
    const urlSearchText = searchParams.get("s") || "";
    const { category } = useParams();

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(urlPage);
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState(urlSubCategory);
    const [openCategoryIds, setOpenCategoryIds] = useState([]);
    const [pricing, setPricing] = useState({ minPrice: urlMinPrice, maxPrice: urlMaxPrice })
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const toggleCategory = (id) => {
        setOpenCategoryIds((prev) =>
            prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        if (settings) {
            fetchPlatformProductsCategories();
        }
    }, [settings]);

    useEffect(() => {
        window.scrollTo(0, 0)

        const minPrice = searchParams.get("minPrice") || "";
        const maxPrice = searchParams.get("maxPrice") || "";
        setPricing({ minPrice, maxPrice });
        

        if (settings) {
            fetchProducts();
        }
    }, [settings, page, category, selectedSubCategory, searchParams]);

    const fetchPlatformProductsCategories = () => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_HOST}/platform/products/fetch-categories?sellerID=${settings?.sellerID}`)
            .then((res) => {
                const { status, data } = res;
                if (status === 200) {
                    setCategories(data?.categories);
                }
            })
            .catch((err) => console.error("Frontend GET error", err.message))
            .finally(() => setLoading(false));
    };
    
    const fetchProducts = () => {
        setLoading(true);

        const params = new URLSearchParams({
            sellerID: settings?.sellerID,
            page,
        });

        if (urlSearchText) params.append("searchText", urlSearchText);
        if (category) params.append("category", category);
        if (selectedSubCategory) params.append("subcategory", selectedSubCategory);
        if (searchParams.get("minPrice")) params.append("minPrice", searchParams.get("minPrice"));
        if (searchParams.get("maxPrice")) params.append("maxPrice", searchParams.get("maxPrice"));

        axios.get(`${import.meta.env.VITE_HOST}/platform/products/fetch-products?${params.toString()}`)
            .then((res) => {
                const { status, data } = res;
                if (status === 200) {
                    setProducts(data?.products || []);
                    setTotalPages(Math.ceil((data?.totalProducts || 0) / 20));
                }
            })
            .catch((err) => console.error("Frontend GET error", err.message))
            .finally(() => setLoading(false));
    };
    console.log('Products',products);
    console.log('page',totalPages);
    const handleCategoryClick = (cat) => {
        setPage(1);
        window.location.href = isCustomDomain
            ? `/products/${cat}`
            : `/brand/${settings?.brandSlug}/pages/products/${cat}`;
    };

    const handleSubcategoryClick = (cat, subcat) => {
        setPage(1);
        setSelectedSubCategory(subcat)
        window.location.href = isCustomDomain
            ? `/products/${cat}?subcategory=${subcat}`
            : `/brand/${settings?.brandSlug}/products/${cat}?subcategory=${subcat}`;
    };

    const handlePricingClick = () => {
        setPage(1);

        const params = new URLSearchParams();

        if (category) params.append("category", category);
        if (selectedSubCategory) params.append("subcategory", selectedSubCategory);

        if (pricing.minPrice) params.append("minPrice", pricing?.minPrice);
        if (pricing.maxPrice) params.append("maxPrice", pricing?.maxPrice);

        

        params.append("page", 1);

        navigate(`?${params.toString()}`);
    };
    

    const clearPricingFilter = () => {
        setPricing({ minPrice: "", maxPrice: "" });

        const params = new URLSearchParams(searchParams);
        params.delete("minPrice");
        params.delete("maxPrice");
        params.set("page", "1");

        navigate(`?${params.toString()}`);
        setPage(1);
    };

    return (
        <div className="pt-12 pb-16">
            <div className="relative main-container">
                <div className="categories-head px-4">
                    <ul className="flex items-center text-sm text-[var(--text)] space-x-2 mb-4">
                        <li>
                            <a href={isCustomDomain
                                ? `/products`
                                : `/brand/${settings?.brandSlug}/products`}
                                className="hover:text-black">Products</a>
                        </li>
                        <li>/</li>
                        <li
                            className="text-[var(--text)] font-bold capitalize"
                            title={category || "products"}
                        >
                            {category || "All Products"}
                        </li>
                    </ul>
                    {category &&
                        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 mb-4">
                            <h2 className="head text-xl md:text-2xl font-bold text-[var(--text)] capitalize">
                                {category || ""}{" "}Items
                            </h2>
                        </div>
                    }
                </div>

                <div className="flex justify-between gap-6">
                    {/* Sidebar */}
                    <aside className=" hidden lg:block w-full max-w-[250px] bg-white">
                        <div className="mb-6">
                            <div className="flex items-center justify-between cursor-pointer p-4">
                                <h3 className="text-sm font-semibold text-[var(--text)]">Categories</h3>
                            </div>

                            <ul>
                                {categories.map((category) => {
                                    const isOpen = openCategoryIds.includes(category._id);
                                    return (
                                        <li key={category._id} className={`${isOpen ? "bg-gray-100" : ""} p-4 rounded-2xl transition-all duration-300 ease-linear hover:bg-gray-100 cursor-pointer`} onClick={() => toggleCategory(category._id)}>
                                            <div className="flex items-center justify-between">
                                                <span className={`${isOpen && 'mb-2'} text-[var(--text)] font-bold text-sm capitalize hover:opacity-70`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCategoryClick(category.name);
                                                    }}
                                                >
                                                    {category.name}
                                                </span>
                                                {category.subcategories?.length > 0 && (
                                                    <ChevronDown className={`w-4 h-4 text-[var(--text)] transition-transform duration-300 hover:opacity-70 ${isOpen ? "rotate-180" : ""}`} />
                                                )}
                                            </div>

                                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                                                {category.subcategories?.length > 0 && (
                                                    <ul className="list-none space-y-2 text-sm text-gray-600">
                                                        {category.subcategories.map((sub, idx) => (
                                                            <li key={idx} className="capitalize hover:opacity-70"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSubcategoryClick(category.name, sub);
                                                                }}
                                                            >
                                                                {sub}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div className="px-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-[var(--text)]">
                                    Selling Price
                                </h3>
                                {(urlMinPrice || urlMaxPrice) && (
                                    <button
                                        onClick={clearPricingFilter}
                                        className="text-xs text-blue-600 hover:text-blue-800"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    className="appearance-none w-full border border-gray-300 rounded-none px-2 py-1 text-sm"
                                    value={pricing.minPrice}
                                    placeholder="Min"
                                    onChange={(e) => setPricing({ ...pricing, minPrice: e.target.value })}
                                />
                                <span>&minus;</span>
                                <input
                                    type="number"
                                    className="appearance-none w-full border border-gray-300 rounded-none px-2 py-1 text-sm"
                                    value={pricing.maxPrice}
                                    placeholder="Max"
                                    onChange={(e) => setPricing({ ...pricing, maxPrice: e.target.value })}
                                />
                            </div>

                            <button className="mt-3 bg-black text-white text-xs w-full py-2.5 rounded-lg"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePricingClick();
                                }}
                            >
                                Apply
                            </button>
                        </div>
                    </aside>

                    {/* Products */}
                    <div className="flex-1 pr-4">
                        {loading ?
                            'Loading...'
                            :
                            products.length > 0 ?
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {products?.map((item, idx) => (
                                        ProductBoxComponent && <ProductBoxComponent item={item} idx={idx} settings={settings} />
                                    ))}
                                </div>
                                :
                                <p className="text-red-500 text-center">No product found!</p>
                        }

                        {totalPages > 1 && (
                            <div className="flex justify-end gap-2 mt-5">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => { setPage(p); navigate(`?page=${p}`) }}
                                        className={`px-3 py-1 text-sm 
                                            ${page === p ? "bg-[var(--pr)] text-white" : "bg-white text-gray-700 hover:bg-gray-200"}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </div >
    );
}