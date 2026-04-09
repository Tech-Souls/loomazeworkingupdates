import { useEffect, useState } from "react";
import axios from "axios";

function ToolsCategories({ settings, isCustomDomain }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const cats = [
    {
      _id: "cat1",
      name: "men",
      imageURL:
        "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=600&auto=format&fit=crop",
    },
    {
      _id: "cat2",
      name: "women",
      imageURL:
        "https://images.unsplash.com/photo-1520975698519-59c3e2b22b36?q=80&w=600&auto=format&fit=crop",
    },
    {
      _id: "cat3",
      name: "kids",
      imageURL:
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop",
    },
    {
      _id: "cat4",
      name: "shoes",
      imageURL:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    },
    {
      _id: "cat5",
      name: "accessories",
      imageURL:
        "https://images.unsplash.com/photo-1512499617640-c2f999098c01?q=80&w=600&auto=format&fit=crop",
    },
    {
      _id: "cat6",
      name: "watches",
      imageURL:
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
    },
  ];

useEffect(() => {
    if (settings) fetchCategories();
  }, [settings]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_HOST}/platform/home/fetch-categories?sellerID=${settings?.sellerID}`,
      );

      if (res.status === 200 && res.data?.categories?.length > 0) {
        setCategories(res.data.categories);
      }

      // else → KEEP demo categories
    } catch (err) {
      console.error("Frontend GET error", err.message);
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  if(categories.length === 0){
    setCategories(cats);
  }
}, [settings])




  return (
    <section className="w-full relative font-[roboto-condensed] flex flex-col mt-15 items-start gap-5  min-h-[80vh] px-5">
      <div className="w-full flex items-center  justify-center flex-col gap-5">
        <h1 className="text-[#E53935] text-2xl font-bold text-center">
          Shop By Cateories
        </h1>
        <h1 className="text-slate-900 font-[bebas-neue] uppercase  text-6xl font-normal  text-center">
          Popular Categories
        </h1>
        <p className="text-lg text-gray-600 text-center">
          Browse categories – tools for every job
        </p>
      </div>
      
    <div className="w-full h-full  grid  lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 p-2 gap-6">
        {
            categories.map((item)=>{
                return (
                    <a
                          href={
                            isCustomDomain
                              ? `/products/${item.name}`
                              : `/brand/${settings?.brandSlug}/pages/products/${item.name}`
                          }
                          target="_blank"
                          className="block group cursor-pointer"
                        >
                    <div key={item._id} className="w-full group  relative h-80 rounded-lg overflow-hidden bg-blue-700">
                        <img src={item.imageURL} alt={item.name} className="w-full cursor-pointer group-hover:scale-120 transition-all duration-300 h-full object-cover"/>
                        <h1 className="absolute bottom-5 w-[90%] flex items-center justify-start px-5 left-1/2 h-15 bg-gray-500/20 backdrop-blur-2xl capitalize group-hover:bg-[#E53935]/60 transform -translate-x-1/2  right-0 cursor-pointer text-3xl font-[bebas-neue] text-white text-center py-2">
                          {item.name}
                        </h1>
                    </div> </a>
                )
            })
        }
    </div>

    </section>
  );
}
       
export default ToolsCategories;
