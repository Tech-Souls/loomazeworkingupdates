import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import ButtonLoader from "../ButtonLoader";

function SellerBrandsContent({ user, settings, setSettings }) {
  const [brandIcons, setBrandIcons] = useState(null);
  const [icons, setIcons] = useState(settings?.content?.brandIcons || []);
  const [loading, setLoading] = useState(false);
  const [deletionLoading, setDeletionLoading] = useState(false);

  useEffect(() => {
     if (settings?.content?.brandIcons) {
      setIcons(settings.content.brandIcons);
    }
  }, [settings]);

   const handleDeleteIcons = (id) => {
  setDeletionLoading(true);

  axios
    .delete(`${import.meta.env.VITE_HOST}/seller/content/brands-iconS-delete/${user._id}`, {
      data: { id },
    })
    .then((res) => {
      if (res.status === 200) {
        window.toastify("icon deleted successfully", "success");

        setIcons((prev) => prev.filter((item) => item._id !== id));
      }
    })
    .catch(() => {
      window.toastify("error while deleting an icon", "error");
    })
    .finally(() => {
      setDeletionLoading(false);
    });
};

  const addBrandIcons = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("icons", brandIcons);
    setLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_HOST}/seller/content/brand-icons/${user._id}`,
        formData,
      )
      .then((res) => {
        const { status, data } = res;
        if (status === 202) {
          setIcons(data.data);

          setSettings((prev) => ({
            ...prev,
            content: {
              ...prev.content,
              brandIcons: data.brandIcons, // <-- update parent
            },
          }));
          setBrandIcons("");
          window.toastify(data.message, "success");
        }
      })
      .catch((err) => {
        window.toastify(
          err.response?.data?.message || "Something went wrong",
          "error",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full mt-10 p-5 border border-gray-400">
      <h1> Brand Icons</h1>
      <div className="w-full h-full   flex items-center justify-between">
        <input
          onChange={(e) => setBrandIcons(e.target.files[0])}
          class="w-full lg:w-1/2 text-sm !p-2.5 bg-white border border-gray-300 cursor-pointer !rounded-none"
          type="file"
          name=""
          id=""
        />
        <button
          onClick={addBrandIcons}
          class="w-fit px-4 py-2 text-xs bg-[var(--primary)] text-white rounded-md mt-4 transition-all duration-200 ease-out hover:opacity-70"
        >
          {!loading ? (
            "Add"
          ) : (
            <span className="flex items-center gap-2">
              Adding <ButtonLoader />
            </span>
          )}
        </button>
      </div>

      <div
        className="w-full bg-white mt-5 p-5
        "
      >
        <h1>Brands Content</h1>
        {icons.map((elem, i) => {
          return (
            <div key={i} className="lg:w-1/2 w-full grid py-5 items-center gap-5  grid-cols-[1fr_20%] ">
              <div className="w-full h-8 flex items-center justify-center  ">
                <img
                  className=" w-10 h-10 object-c items-center justify-start"
                  src={elem.imageURL}
                  alt="BRAND ICONS"
                />
              </div>
              <div className="w-full  text-red-500 hover:opacity-70 cursor-pointer ">
                {!deletionLoading ? (
                              <Trash2
                                size={16}
                                className="text-red-500 cursor-pointer hover:opacity-70"
                                onClick={() => handleDeleteIcons(elem._id)}
                              />
                            ) : (
                              <span className="w-6 h-6 border-t border-red-500 rounded-full animate-spin"></span>
                            )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SellerBrandsContent;
