import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import axios from "axios";
import ButtonLoader from "../ButtonLoader";

export default function SelllerStripperContent({
  user,
  settings,
  setSettings,
}) {
  const [loading, setLoading] = useState(false);
  const [stripperText, setStripperText] = useState("");
  const [StripperImage, setStripperImage] = useState("");
  const [topStripperText, settopStripperText] = useState(
    settings.content.stripperContent || [],
  );
  const [deletionLoading, setDeletionLoading] = useState(false);

  useEffect(() => {
    if (settings?.content?.stripperText) {
      settopStripperText(settings.content.stripperText);
    }
  }, [settings]); // Jab bhi settings update hongi, ye state ko sync kar dega

  const handleAddNotificationText = () => {
    // if (!stripperText.trim()) return window.toastify("Please enter a Stripper Text", "info")

    const formData = new FormData();
    formData.append("stripperText", stripperText);
    formData.append("stripperImage", StripperImage);

    setLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_HOST}/seller/content/stripper-text/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )
      .then((res) => {
        const { status, data } = res;
        if (status === 202) {
          settopStripperText(data.stripperContent);

          setSettings((prev) => ({
            ...prev,
            content: {
              ...prev.content,
              stripperContent: data.stripperContent, // <-- update parent
            },
          }));

          setStripperText("");
          setStripperImage("");

          window.toastify(data.message, "success");
        }
      })
      .catch((err) => {
        window.toastify(
          err.response?.data?.message || "Something went wrong",
          "error",
        );
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteStripper = async (id) => {
    try {
      setDeletionLoading(true);

      const res = await axios.delete(
        `${import.meta.env.VITE_HOST}/seller/content/stripper-text-delete/${user._id}`,
        { data: { id } },
      );

      if (res.status === 200) {
        window.toastify("Slide is deleted", "success");

        // update UI instantly
        settopStripperText((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      window.toastify("Error while deleting slide", "error");
    } finally {
      setDeletionLoading(false);
    }
  };

  return (
    <div className="p-4 border  border-gray-200 mt-6">
      <p className="head text-base text-gray-900 font-bold mb-4">
        Show Stripper Bar
      </p>

      <div className="relative flex justify-center items-end p-3 w-full bg-gray-100 border border-gray-200">
        <p className="text-sm text-gray-800">
          {topStripperText?.[0]?.text || "Notification title"}
        </p>{" "}
        <ArrowLeft
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700"
        />
        <ArrowRight
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
        />
      </div>

      <div className="mt-6">
        <label className="block mb-3 text-sm font-bold text-gray-900">
          Add Stripper Text
        </label>
        <div className="flex  gap-5">
          <input
            value={stripperText}
            onChange={(e) => {
              setStripperText(e.target.value);
            }}
            type="text"
            name="notificationText"
            id="notificationText"
            placeholder="Type notifcation text to show"
            className="text-sm w-full max-w-sm !p-2.5 bg-white border border-gray-300 !rounded-none"
          />
          <input
            onChange={(e) => {
              setStripperImage(e.target.files[0]);
            }}
            className="text-sm w-full max-w-sm !p-2.5 bg-white border border-gray-300 !rounded-none"
            type="file"
          />
          <button
            className="text-xs bg-[var(--primary)] text-white px-4 transition-all duration-200 hover:bg-[var(--primary)]/70"
            onClick={handleAddNotificationText}
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
      </div>

      <p className="text-sm text-gray-900 font-bold mt-4 mb-2">Stripper Text</p>
      <div className="flex flex-col items-start justify-center gap-2">
        {topStripperText.map((elem, i) => (
          <div
            key={elem._id}
            className="min-w-1/4 px-5 flex h-10 items-center  justify-between gap-4"
          >
            <p className="text-sm text-gray-800">
              {i + 1}. {elem.text}
            </p>
            <img
              className="h-full w-15 object-cover"
              src={elem.imageURL}
              alt=""
            />
            {!deletionLoading ? (
              <Trash2
                size={16}
                className="text-red-500 cursor-pointer hover:opacity-70"
                onClick={() => handleDeleteStripper(elem._id)}
              />
            ) : (
              <span className="w-6 h-6 border-t border-red-500 rounded-full animate-spin"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
