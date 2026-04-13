import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSellerAuthContext } from '../../../../../contexts/SellerAuthContext';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { IoImageOutline } from "react-icons/io5";
import { BiCheck, BiPlusCircle } from 'react-icons/bi';
import VariantTable from '../../../../../components/VariantTable';
import ButtonLoader from '../../../../../components/ButtonLoader';
import Loader from '../../../../../components/Loader';
import axios from 'axios';

const initialState = {
    title: "", description: "", category: "", subcategory: "", sku: "", price: 0, comparedPrice: 0, stock: 0, weight: 0, weightUnit: "kg",
    taxable: false, isFeatured: false, sizeChart: null, tags: [], paymentModes: [], boughtTogether: [], mainImageURL: ""
}

export default function EditProduct() {
    const { productID } = useParams()
    const { user } = useSellerAuthContext()
    const [state, setState] = useState(initialState)
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [sizeCharts, setSizeCharts] = useState([])

    const [option, setOption] = useState({ name: "", values: [] })
    const [selectedOption, setSelectedOption] = useState(null)
    const [optionValue, setOptionValue] = useState("");
    const [showOptionFields, setShowOptionFields] = useState(false)

    const [options, setOptions] = useState([])
    const [variants, setVariants] = useState([])

    const [search, setSearch] = useState("")
    const [results, setResults] = useState([])
    const [searching, setSearching] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const mainImageRef = useRef()
    const [mainImage, setMainImage] = useState(null)
    const [mainImagePreview, setMainImagePreview] = useState(null)

    useEffect(() => {
        if (productID) {
            fetchProduct()
            fetchCategories()
            fetchSizeCharts()
        }
    }, [productID])

    useEffect(() => {
        if (state.category && categories.length > 0) {
            const categoryFromProduct = categories.find(cat => cat.name === state.category);
            if (categoryFromProduct) {
                setSelectedCategory(categoryFromProduct);
            }
        }
    }, [categories, state.category]);

    const fetchProduct = () => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/edit-product/fetch-product?sellerID=${user._id}&productID=${productID}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    const product = data?.product || {};

                    // Normalize product fields into state shape
                    const processedProduct = {
                        ...initialState,
                        ...product,
                        sizeChart: product.sizeChart?._id || product.sizeChart || null,
                        tags: product.tags || [],
                        paymentModes: product.paymentModes || [],
                        boughtTogether: product.boughtTogether || [],
                        mainImageURL: product.mainImageURL || ""
                    };

                    // Set main image preview to existing URL
                    setMainImage(null);
                    setMainImagePreview(processedProduct.mainImageURL ? `${processedProduct.mainImageURL}` : null);

                    // Set options & variants into local states (consistent with AddProduct)
                    const fetchedOptions = product.options || [];
                    setOptions(fetchedOptions);

                    const fetchedVariants = (product.variants || []).map(variant => ({
                        ...variant,
                        // keep server-side imageURL (path) and expose preview to UI
                        imageFile: null,
                        imagePreview: variant.imageURL ? `${variant.imageURL}` : "",
                        imageURL: variant.imageURL || "",
                        // ensure numeric fields are numbers
                        price: variant.price != null ? Number(variant.price) : 0,
                        stock: variant.stock != null ? Number(variant.stock) : 0,
                    }));

                    setVariants(fetchedVariants);

                    // store full product data in state (so other fields like title, price, etc. are available)
                    setState(prev => ({
                        ...prev,
                        ...processedProduct,
                        // don't overwrite options/variants here (we manage them via local states)
                    }));

                    // select category if present in already-fetched categories
                    if (product.category) {
                        const categoryFromProduct = categories.find(cat => cat.name === product.category);
                        if (categoryFromProduct) {
                            setSelectedCategory(categoryFromProduct);
                        }
                    }
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

    const handleChange = (e) => setState(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                return alert("Only PNG, JPG or WEBP files are allowed!");
            }

            setMainImage(file);
            setMainImagePreview(URL.createObjectURL(file))
        }
    }

    const fetchCategories = () => {
        axios.get(`${import.meta.env.VITE_HOST}/seller/edit-product/fetch-categories?sellerID=${user._id}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setCategories(data?.categories || [])
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
    }

    const fetchSizeCharts = () => {
        axios.get(`${import.meta.env.VITE_HOST}/seller/edit-product/fetch-size-charts?sellerID=${user._id}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setSizeCharts(data?.sizeCharts || [])
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
    }

    const handlePaymentModeUpdate = (mode) => {
        setState(prev => {
            const exists = prev.paymentModes.includes(mode);
            return {
                ...prev,
                paymentModes: exists
                    ? prev.paymentModes.filter(payMode => payMode !== mode)
                    : [...prev.paymentModes, mode]
            };
        });
    };

    useEffect(() => {
        setSearching(true);
        const delayDebounce = setTimeout(() => {
            if (search.trim().length > 1) {
                axios.get(`${import.meta.env.VITE_HOST}/seller/edit-product/frequent-bought-search?sellerID=${user._id}&q=${search}`)
                    .then(res => setResults(res.data.products || []))
                    .catch(err => console.error(err))
                    .finally(() => setSearching(false))
            } else {
                setResults([]);
                setSearching(true);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [search]);

    const handleAddFrequentProduct = (product) => {
        if (!state.boughtTogether.some(p => p._id === product._id)) {
            setState(prev => ({
                ...prev,
                boughtTogether: [...prev.boughtTogether, product]
            }));
        }
        setSearch("");
        setResults([]);
    };

    const handleRemoveFrequentProduct = (id) => {
        setState(prev => ({
            ...prev,
            boughtTogether: prev.boughtTogether.filter(p => p._id !== id)
        }));
    };

    const generateVariants = (optionsArr, existingVariants = []) => {
        if (optionsArr.length === 0) return [];

        const generateUniqueId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

        const valuesArray = optionsArr.map(opt => opt.values);

        const combine = (arr) => {
            if (arr.length === 1) return arr[0].map(v => [v]);

            const result = [];
            const first = arr[0];
            const rest = combine(arr.slice(1));

            first.forEach(f => {
                rest.forEach(r => {
                    result.push([f, ...r]);
                });
            });

            return result;
        };

        const newVariants = combine(valuesArray);

        return newVariants.map(v => {
            // Try to find existing variant with same option values
            const existingVariant = existingVariants.find(ev =>
                ev.optionValues.length === v.length &&
                ev.optionValues.every((val, idx) => val === v[idx])
            );

            if (existingVariant) {
                // Preserve existing values
                return {
                    ...existingVariant,
                    optionValues: v,
                };
            }

            // Create new variant
            return {
                id: generateUniqueId(),
                optionValues: v,
                price: 0,
                stock: 0,
                imageFile: null,
                imagePreview: "",
                imageURL: ""
            };
        });
    };

    const handleDeleteOption = () => {
        if (selectedOption !== null) {
            const updatedOptions = options.filter((_, idx) => idx !== selectedOption);
            const newVariants = generateVariants(updatedOptions, variants);
            setOptions(updatedOptions);
            setVariants(newVariants);
            // setState(prev => ({ ...prev, options: updatedOptions, variants: newVariants }));
        }
        setOption({ name: "", values: [] })
        setSelectedOption(null)
        setShowOptionFields(false)
    }

    const handleSaveOption = () => {
        if (!option.name.trim()) return window.toastify("Enter option name", "warning")
        if (option.values.length <= 0) return window.toastify("Enter option values", "warning")

        const nameExists = options.some((opt, idx) => opt.name === option.name && idx !== selectedOption)
        if (nameExists) return window.toastify("Option name already exists", "warning")

        let updatedOptions = [];

        if (selectedOption === null) {
            updatedOptions = [...options, option]
        } else {
            updatedOptions = options.map((opt, idx) => idx === selectedOption ? option : opt)
        }

        const newVariants = generateVariants(updatedOptions, variants);
        // Keep both local states and state copy consistent
        setOptions(updatedOptions);
        setVariants(newVariants);
        // setState(prev => ({
        //     ...prev,
        //     options: updatedOptions,
        //     variants: newVariants
        // }));

        setOption({ name: "", values: [] })
        setOptionValue("")
        setSelectedOption(null)
        setShowOptionFields(false)
    }

    const handleEditProduct = () => {
        const {
            title, description, category, subcategory, sku, price, comparedPrice, taxable,
            weight, weightUnit, isFeatured, stock, sizeChart, tags, paymentModes, boughtTogether
        } = state

        if (!title) return window.toastify("Title is required!", "info")
        if (!mainImage && !state.mainImageURL) return window.toastify("Image is required!", "info")
        if (!price || Number(price) <= 0) return window.toastify("Enter Price of the product!", "info")
        if (!paymentModes || paymentModes.length === 0) return window.toastify("At least one payment method is required!", "info")
        if (stock < 0) return window.toastify("Stock cannot be negative!", "info")
        if (comparedPrice < 0) return window.toastify("Compared price cannot be negative!", "info")

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description || "");
        formData.append("category", category || "");
        formData.append("subcategory", subcategory || "");
        formData.append("sku", sku || "");
        formData.append("price", price);
        formData.append("comparedPrice", comparedPrice || 0);
        formData.append("taxable", taxable);
        formData.append("isFeatured", isFeatured);
        formData.append("stock", stock);
        formData.append("weight", weight);
        formData.append("weightUnit", weightUnit);
        formData.append("sizeChart", sizeChart || "");
        formData.append("tags", JSON.stringify(tags || []));
        formData.append("paymentModes", JSON.stringify(paymentModes || []));
        formData.append("boughtTogether", JSON.stringify((boughtTogether || []).map(product => product._id)));

        if (mainImage) formData.append("mainImage", mainImage);

        formData.append("options", JSON.stringify(options || []));

        // Prepare variants data without imageFile and imagePreview
        const variantsData = variants.map(variant => ({
            id: variant.id,
            optionValues: variant.optionValues,
            price: variant.price,
            stock: variant.stock,
            imageURL: variant.imageURL || "" // existing image URL path (backend expects this)
        }));
        formData.append("variants", JSON.stringify(variantsData));

        variants.forEach(variant => {
            if (variant.imageFile) {
                formData.append(`variantImage_${variant.id}`, variant.imageFile);
            }
        });

        setLoading(true);
        axios.post(`${import.meta.env.VITE_HOST}/seller/edit-product/update?productID=${productID}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(res => {
                if (res.status === 202) {
                    window.toastify(res.data.message, "success")

                    const updatedProduct = res.data.product;
                    const processedProduct = {
                        ...initialState,
                        ...updatedProduct,
                        sizeChart: updatedProduct.sizeChart?._id || updatedProduct.sizeChart || null,
                        tags: updatedProduct.tags || [],
                        paymentModes: updatedProduct.paymentModes || [],
                        boughtTogether: updatedProduct.boughtTogether || [],
                        mainImageURL: updatedProduct.mainImageURL || ""
                    };

                    // Map updated variants to UI format
                    if (updatedProduct.variants) {
                        const updatedVariants = updatedProduct.variants.map(variant => ({
                            ...variant,
                            imageFile: null,
                            imagePreview: variant.imageURL ? `${import.meta.env.VITE_HOST}${variant.imageURL}` : "",
                            imageURL: variant.imageURL || "",
                            price: variant.price != null ? Number(variant.price) : 0,
                            stock: variant.stock != null ? Number(variant.stock) : 0,
                        }));

                        setVariants(updatedVariants);
                        processedProduct.variants = updatedVariants;
                    } else {
                        setVariants([]);
                    }

                    // Update options
                    setOptions(updatedProduct.options || []);
                    processedProduct.options = updatedProduct.options || [];

                    setState(prev => ({ ...prev, ...processedProduct }));

                    // reset local main image upload
                    setMainImage(null);
                    setMainImagePreview(processedProduct.mainImageURL ? `${import.meta.env.VITE_HOST}${processedProduct.mainImageURL}` : null);
                }
            })
            .catch(err => {
                console.error("Frontend POST error", err.message)
                window.toastify(err.response?.data?.message || "Something went wrong! Please try again", "error")
            })
            .finally(() => setLoading(false));
    }

    if (loading) return <Loader />

    return (
        <>
            <div className='bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4'>
                <p className='font-bold text-gray-900'>Edit Product</p>
                <p className='text-[12px] sm:text-[13px] text-gray-900'>Edit an existing product of your inventory here.</p>
            </div>

            <div className='seller-container !pb-20'>
                <div className='flex justify-between items-center'>
                    <p className='w-fit text-[12px] font-bold'><span className='text-gray-400'>Seller</span> / Inventory / Manage Products / Edit</p>
                    <div className='flex gap-2'>
                        <button className='px-4 py-1.5 text-xs bg-gray-100 text-gray-800 font-bold rounded-[8px] transition-all duration-200 ease-linear hover:bg-gray-200' onClick={() => navigate(-1)}>Cancel</button>
                        <button className='flex items-center gap-2 px-4 py-1.5 text-xs bg-[var(--primary)] text-white font-bold rounded-[8px] transition-all duration-200 ease-linear hover:bg-[var(--primary)]/70'
                            disabled={loading}
                            onClick={handleEditProduct}
                        >
                            {!loading ? 'Save' : <>Saving <ButtonLoader /></>}
                        </button>
                    </div>
                </div>

                <p className='w-fit bg-yellow-50 text-yellow-600 text-xs mt-4 px-2 py-1'>All fields with * are mandatory</p>

                <div className='flex justify-between gap-5 mt-4'>
                    <div className='flex flex-col flex-1 gap-5'>
                        <div className='flex flex-col gap-4 p-4 sm:p-6 bg-white shadow'>
                            {/* Title */}
                            <div className='grid grid-cols-1'>
                                <div>
                                    <label className='text-sm text-gray-900 font-bold'>Title *</label>
                                    <input type="text" name="title" id="title" placeholder='Enter title of product' value={state?.title || ""} className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handleChange} />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className='text-sm text-gray-900 font-bold'>Description</label>
                                <ReactQuill theme="snow" placeholder='Enter detailed description of product...' value={state.description || ""} className='block w-full text-sm bg-white border border-none !rounded-none mt-3 mb-12 h-[300px]' onChange={(val) => setState((prev) => ({ ...prev, description: val }))} />
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {/* Category */}
                                <div>
                                    <label className="text-sm text-gray-900 font-bold">Category</label>
                                    <select
                                        name="category"
                                        value={state.category || ""}
                                        onChange={(e) => {
                                            const selectedCat = categories.find(cat => cat.name === e.target.value);
                                            setSelectedCategory(selectedCat);
                                            setState(prev => ({
                                                ...prev,
                                                category: e.target.value,
                                                subcategory: ""
                                            }));
                                        }}
                                        className="block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat.name} className='capitalize'>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subcategory */}
                                {selectedCategory && selectedCategory.subcategories?.length > 0 && (
                                    <div>
                                        <label className="text-sm text-gray-900 font-bold">Subcategory</label>
                                        <select
                                            name="subcategory"
                                            value={state.subcategory || ""}
                                            onChange={(e) =>
                                                setState(prev => ({ ...prev, subcategory: e.target.value }))
                                            }
                                            disabled={!selectedCategory}
                                            className="block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3"
                                        >
                                            <option value="">Select Subcategory</option>
                                            {selectedCategory.subcategories.map((sub, i) => (
                                                <option key={i} value={sub} className='capitalize'>
                                                    {sub}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='flex flex-col gap-4 p-4 sm:p-6 bg-white shadow'>
                            {/* Prices & Stock */}
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                                <div>
                                    <label className='text-sm text-gray-900 font-bold'>Price *</label>
                                    <input type="number" name="price" id="price" placeholder='Enter original price' value={state.price || ""} className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handleChange} />
                                </div>
                                <div>
                                    <label className='text-sm text-gray-900 font-bold'>Compare At Price</label>
                                    <input type="number" name="comparedPrice" id="comparedPrice" placeholder='1000' value={state.comparedPrice || ""} className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handleChange} />
                                </div>
                                <div>
                                    <label className='text-sm text-gray-900 font-bold'>Stock (Quantity)</label>
                                    <input type="number" name="stock" id="stock" placeholder='50' value={state.stock || ""} className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handleChange} />
                                </div>

                                {/* Size Chart */}
                                <div>
                                    <label className='text-sm text-gray-900 font-bold'>Size Chart</label>
                                    <select
                                        name="sizeChart"
                                        value={state.sizeChart || ""}
                                        onChange={(e) => {
                                            setState(prev => ({
                                                ...prev,
                                                sizeChart: e.target.value === "" ? null : e.target.value,
                                            }));
                                        }}
                                        className="block w-full text-sm !p-2.5 bg-white border border-gray-300 !rounded-none mt-3"
                                    >
                                        <option value="">Select Size Chart</option>
                                        {sizeCharts.map(chart => (
                                            <option key={chart._id} value={chart._id} className='capitalize'>
                                                {chart.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Variants */}
                        <div className='flex flex-col p-4 sm:p-6 bg-white shadow'>
                            <div className='mb-6'>
                                <p className='text-sm text-gray-900 font-bold'>Variants</p>
                                <p className='w-fit text-xs bg-amber-100 text-amber-600 px-2 py-1 mt-1'>Add options like size or color</p>
                            </div>

                            {/* Options */}
                            <div>
                                {options && options.length > 0 &&
                                    options.map((opt, i) => {
                                        const { name, values } = opt
                                        return (
                                            <div key={i} role='button' className='p-6 border-t border-l border-r border-gray-200 hover:bg-gray-100/60 cursor-pointer'
                                                onClick={() => {
                                                    setSelectedOption(i)
                                                    setShowOptionFields(true)
                                                    setOption({ ...opt, values: [...opt.values] })
                                                }}
                                            >
                                                <p className='text-sm font-semibold'>{name}</p>
                                                <div className='flex items-center gap-2 mt-3'>
                                                    {values.map((v, idx) => (
                                                        <span key={idx} className='text-xs bg-gray-200 text-gray-700 px-3.5 py-1 border border-gray-200 rounded-lg'>{v}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                                {showOptionFields &&
                                    <div className='p-6 border-t border-l border-r border-gray-200'>
                                        <div className='flex flex-col gap-4'>
                                            <div>
                                                <label className='text-sm text-gray-900 font-bold'>Option name</label>
                                                <input type="text" name="optionName" id="optionName" value={option.name} placeholder='Size' className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={e => setOption(prev => ({ ...prev, name: e.target.value }))} />
                                            </div>
                                            <div>
                                                <label className='text-sm text-gray-900 font-bold'>Option values</label>

                                                {/* Option Values Display */}
                                                {option.values.length > 0 &&
                                                    <div className="flex gap-1.5 flex-wrap mt-2">
                                                        {option.values.map((v, ix) => (
                                                            <span
                                                                key={ix}
                                                                className="px-3 py-1 text-xs bg-gray-200 rounded-full flex items-center gap-2"
                                                            >
                                                                {v}
                                                                <button className="text-red-600 font-bold"
                                                                    onClick={() =>
                                                                        setOption(prev => ({
                                                                            ...prev,
                                                                            values: prev.values.filter((_, idx) => idx !== ix)
                                                                        }))
                                                                    }
                                                                >
                                                                    ×
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                }

                                                <input type="text" name="optionValue" id="optionValue" value={optionValue} placeholder='Small, Medium, Large' className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={e => setOptionValue(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();

                                                            if (!optionValue.trim()) return;

                                                            setOption((prev) => ({
                                                                ...prev,
                                                                values: [...prev.values, optionValue.trim()]
                                                            }));

                                                            setOptionValue("");
                                                        }
                                                    }}
                                                />

                                                <p className='text-xs text-gray-700 mt-2'>Press 'Enter' to add option value</p>
                                            </div>

                                            <div className='flex justify-between gap-4'>
                                                <button className='text-xs bg-white text-red-500 border border-neutral-300 px-3.5 py-1.5 font-semibold rounded-lg transition-all duration-300 ease-out hover:opacity-70'
                                                    onClick={handleDeleteOption}
                                                >
                                                    Delete
                                                </button>

                                                <button className='text-xs bg-(--primary) text-white px-3.5 py-1.5 font-semibold rounded-lg transition-all duration-300 ease-out hover:opacity-70'
                                                    onClick={handleSaveOption}
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>

                            <button className='flex w-full items-center gap-1 text-xs text-gray-800 font-semibold px-4 py-2.5 border border-gray-200 hover:bg-gray-100 cursor-pointer'
                                onClick={() => {
                                    setOption({ name: "", values: [] })
                                    setOptionValue("")
                                    setSelectedOption(null)
                                    setShowOptionFields(true)
                                }}
                            >
                                <BiPlusCircle size={18} /> {options && options.length > 0 ? "Add another option" : "Add options like size or color"}
                            </button>

                            {/* Variants Groups */}
                            <VariantTable options={options} variants={variants} setVariants={setVariants} />
                        </div>

                        <div className='flex flex-col gap-4 p-4 sm:p-6 bg-white shadow'>
                            {/* Weight */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className="text-sm text-gray-900 font-bold">Weight Unit</label>
                                    <select
                                        name="weightUnit"
                                        value={state.weightUnit || "kg"}
                                        onChange={handleChange}
                                        className="block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3"
                                    >
                                        <option value="" disabled>Select a weight unit</option>
                                        <option value="g">Gram (g)</option>
                                        <option value="kg">Kilogram (kg)</option>
                                        <option value="lb">Pound (lb)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='text-sm text-gray-900 font-bold'>Weight</label>
                                    <input type="number" name="weight" id="weight" placeholder='Enter weight of product' value={state.weight || ""} className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handleChange} />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-900 font-bold">Products That Go Together</label>

                                <input
                                    type="text"
                                    placeholder="Search by title, product ID or sku..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="mt-2 w-full border border-gray-300 !p-3 !rounded-none text-sm"
                                />

                                {/* Suggestions */}
                                {search !== "" && (
                                    searching ? (
                                        <div className='flex flex-col justify-center items-center gap-4 p-4 border border-[var(--secondary)] mt-1 bg-white'>
                                            <span className='w-8 h-8 border-t-2 border-[var(--secondary)] rounded-full animate-spin'></span>
                                            <p className='text-sm'>Searching...</p>
                                        </div>
                                    )
                                        :
                                        (results?.length > 0 ? (
                                            <ul className="border border-[var(--secondary)] mt-1 bg-white max-h-48 overflow-y-auto shad">
                                                {results.map(product => (
                                                    <li
                                                        key={product._id}
                                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                                                        onClick={() => handleAddFrequentProduct(product)}
                                                    >
                                                        <span className='flex items-center gap-4 text-sm text-gray-900'>
                                                            <img src={`${import.meta.env.VITE_HOST}${product.mainImageURL}`} alt={product.title} className='w-8 h-8' />
                                                            {product.title}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            <span className='text-red-400 line-through text-[11px]'>{product.price}</span>{" "}
                                                            {product.comparedPrice}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <ul className="border border-[var(--secondary)] mt-1 bg-white max-h-48 overflow-y-auto shad">
                                                <li className="text-sm text-red-500 px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center">
                                                    No such product found!
                                                </li>
                                            </ul>
                                        ))
                                )}

                                {/* Selected Bought Together Products */}
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {state?.boughtTogether?.map(product => (
                                        <span
                                            key={product._id}
                                            className="flex items-center gap-1 bg-gray-200 text-gray-900 px-3 py-1 rounded-full text-xs"
                                        >
                                            {product.title}
                                            <button
                                                type="button"
                                                className="text-red-500 ml-1"
                                                onClick={() => handleRemoveFrequentProduct(product._id)}
                                            >
                                                ✕
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-6 w-full max-w-[400px]'>
                        <div className='p-4 sm:p-6 bg-white shadow'>
                            <label className='text-sm text-gray-900 font-bold'>Main Image *</label>
                            <div className='group relative w-full h-[300px] border-2 border-dashed border-gray-300 mt-3 transition-all duration-200 ease-linear hover:border-[var(--secondary)]'>
                                <input ref={mainImageRef} type="file" accept='image/*' name="mainImage" id="mainImage" className='invisible w-full h-full'
                                    onChange={handleMainImageChange}
                                />

                                <div className='flex flex-col justify-center items-center absolute inset-0 p-3 text-gray-500 cursor-pointer transition-all duration-200 ease-linear group-hover:text-[var(--secondary)]' onClick={() => mainImageRef.current.click()}>
                                    {
                                        !mainImage && !state.mainImageURL ? (
                                            <>
                                                <IoImageOutline className='text-[50px] mb-3' />
                                                <p className='text-sm font-bold'>Select Main Image of Product</p>
                                                <p className='text-[10px] mt-1'>(Only PNG, JPEG or WEBP allowed)</p>
                                            </>
                                        ) : (
                                            <div className='h-full'>
                                                <img
                                                    src={mainImagePreview || state.mainImageURL}
                                                    alt="product-main-image"
                                                    className='max-h-full'
                                                />
                                                {
                                                    mainImage &&
                                                    <div className="absolute top-3 right-5">
                                                        <button className='text-gray-900'
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMainImage(null);
                                                                setMainImagePreview(null);
                                                            }}
                                                        >
                                                            x
                                                        </button>
                                                    </div>
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col gap-4 p-4 sm:p-6 bg-white shadow'>
                            {/* SKU */}
                            <div>
                                <label className="text-sm text-gray-900 font-bold">SKU</label>
                                <input type="text" name="sku" id="sku" placeholder='Enter service keeping unit (SKU)' value={state?.sku || ""} className='block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3' onChange={handleChange} />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="text-sm text-gray-900 font-bold">Tags</label>
                                <input type="text" placeholder="Type and press Enter or comma to add tags" className="block w-full text-sm !p-3 bg-white border border-gray-300 !rounded-none mt-3"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === ",") {
                                            e.preventDefault();
                                            const rawTags = e.target.value.split(",");
                                            const newTags = rawTags
                                                .map((t) => t.trim().toLowerCase())
                                                .filter((t) => t.length > 0 && !state.tags.includes(t));

                                            if (newTags.length > 0) {
                                                setState((prev) => ({
                                                    ...prev,
                                                    tags: [...prev.tags, ...newTags],
                                                }));
                                            }
                                            e.target.value = "";
                                        }
                                    }}
                                />

                                {/* Display tags */}
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                    {state?.tags?.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs capitalize"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                className="text-red-500 hover:text-red-300 text-[10px] font-bold"
                                                onClick={() =>
                                                    setState((prev) => ({
                                                        ...prev,
                                                        tags: prev.tags.filter((t) => t !== tag),
                                                    }))
                                                }
                                            >
                                                ✕
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col gap-4 p-4 sm:p-6 bg-white shadow'>
                            <div>
                                <label className="text-sm text-gray-900 font-bold">Payment Methods *</label>

                                <div className='flex justify-between items-center gap-5 my-3'>
                                    <span className='text-sm text-gray-700'>Cash On Delivery</span>
                                    <span className={`relative inline-block w-10 h-5 border cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ease-linear ${state?.paymentModes?.includes("cod") ? 'bg-[#ddffe0] border-green-100' : 'bg-gray-200 border-gray-200'}`}
                                        onClick={() => handlePaymentModeUpdate("cod")}
                                    >
                                        <span className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 flex justify-center items-center rounded-full transition-all duration-300 ease-linear ${state?.paymentModes?.includes("cod") ? 'bg-[#53f163] left-[calc(100%-18px)]' : 'bg-white left-[2px]'}`}><BiCheck className='text-white' /></span>
                                    </span>
                                </div>
                                <div className='flex justify-between items-center gap-5'>
                                    <span className='text-sm text-gray-700'>Online Payment</span>
                                    <span className={`relative inline-block w-10 h-5 border cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ease-linear ${state?.paymentModes?.includes("online") ? 'bg-[#ddffe0] border-green-100' : 'bg-gray-200 border-gray-200'}`}
                                        onClick={() => handlePaymentModeUpdate("online")}
                                    >
                                        <span className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 flex justify-center items-center rounded-full transition-all duration-300 ease-linear ${state?.paymentModes?.includes("online") ? 'bg-[#53f163] left-[calc(100%-18px)]' : 'bg-white left-[2px]'}`}><BiCheck className='text-white' /></span>
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-900 font-bold">Tax Information</label>
                                <div className='flex justify-between items-center gap-5 my-3'>
                                    <span className='text-sm text-gray-700'>Taxable</span>
                                    <span className={`relative inline-block w-10 h-5 border cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ease-linear ${state?.taxable ? 'bg-[#ddffe0] border-green-100' : 'bg-gray-200 border-gray-200'}`}
                                        onClick={() => setState(prev => ({ ...prev, taxable: !prev.taxable }))}
                                    >
                                        <span className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 flex justify-center items-center rounded-full transition-all duration-300 ease-linear ${state?.taxable ? 'bg-[#53f163] left-[calc(100%-18px)]' : 'bg-white left-[2px]'}`}><BiCheck className='text-white' /></span>
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-900 font-bold">Featured Product</label>
                                <div className='flex justify-between items-center gap-5 my-3'>
                                    <span className='text-sm text-gray-700'>Add To Featured Products</span>
                                    <span className={`relative inline-block w-10 h-5 border cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ease-linear ${state?.isFeatured ? 'bg-[#ddffe0] border-green-100' : 'bg-gray-200 border-gray-200'}`}
                                        onClick={() => setState(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
                                    >
                                        <span className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 flex justify-center items-center rounded-full transition-all duration-300 ease-linear ${state?.isFeatured ? 'bg-[#53f163] left-[calc(100%-18px)]' : 'bg-white left-[2px]'}`}><BiCheck className='text-white' /></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
