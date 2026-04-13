import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSellerAuthContext } from "../../../../contexts/SellerAuthContext";
import { MdOutlineEdit } from "react-icons/md";
import { RxTrash } from "react-icons/rx";
import { LuSearch } from "react-icons/lu";
import axios from "axios";
import { BiX } from "react-icons/bi";

export default function ManagePayments() {
  const [searchParams] = useSearchParams();
  const urlPage = parseInt(searchParams.get("page")) || 1;

  const { user } = useSellerAuthContext();
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(urlPage);
  const [totalPages, setTotalPages] = useState(1);
  const [currency, setCurrency] = useState("");
  const [searchText, setSearchText] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  console.log("Payment", payments);

  useEffect(() => {
    // wait until user is available
    if (!user?._id) return;

    if (activeSearch) {
      fetchSearchedPayments(activeSearch, page);
    } else {
      fetchPayments(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, activeSearch, page]);

    const fetchPayments = (page = 1) => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_HOST}/seller/manage-payments/all?sellerID=${user._id}&page=${page}`)
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    setPayments(data?.payments || [])
                    setTotalPages(Math.ceil((data?.totalPayments || 0) / 20));
                    setCurrency(data?.currency)
                }
            })
            .catch(err => console.error('Frontend GET error', err.message))
            .finally(() => setLoading(false))
    }

  const fetchSearchedPayments = (text, page = 1) => {
    setLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_HOST}/seller/manage-payments/search?sellerID=${user._id}&searchText=${text}&page=${page}`
      )
      .then((res) => {
        if (res.status === 200) {
          setPayments(res.data?.searchedPayments || []);
          setTotalPages(
            Math.ceil((res.data?.totalSearchedPayments || 0) / 20)
          );
        }
      })
      .catch((err) => console.error("Frontend GET error", err.message))
      .finally(() => setLoading(false));
  };

  const handleSearch = () => {
    if (!searchText) return setActiveSearch("");
    setActiveSearch(searchText);
  };

  const handleUpdatePaymentStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_HOST}/seller/manage-payments/update-status`,
        {
          paymentID: selectedPayment._id,
          status: selectedPayment.status,
        }
      );
      if (res.status === 202) {
        const updatedPayments = payments.map((payment) =>
          payment._id === selectedPayment._id
            ? { ...payment, status: selectedPayment.status }
            : payment
        );
        setPayments(updatedPayments);

        setShowUpdateModal(false);
        setSelectedPayment(null);

        window.toastify("Payment status updated!", "success");
      }
    } catch (err) {
      console.error("Frontend UPDATE error", err.message);
      window.toastify(
        (err.response && err.response.data && err.response.data.message) ||
          "Something went wrong! Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;

    setLoading(true);
    axios
      .delete(`${import.meta.env.VITE_HOST}/seller/manage-payments/delete/${id}`)
      .then((res) => {
        if (res.status === 203) {
          window.toastify(res.data.message, "success");
          setPayments((prev) => prev.filter((payment) => payment._id !== id));
        }
      })
      .catch((err) => {
        console.error("Frontend DELETE error", err.message);
        window.toastify(
          (err.response && err.response.data && err.response.data.message) ||
            "Failed to delete order",
          "error"
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="bg-[#fafafa] px-3 sm:px-5 md:px-8 py-2.5 sm:py-4">
        <p className="font-bold text-gray-900">Manage Payments</p>
        <p className="text-[12px] sm:text-[13px] text-gray-900">
          Monitor, manage and control all the payments received on your store.
        </p>
      </div>

      <div className="seller-container">
        <div className="flex justify-between items-center gap-5">
          <p className="w-fit text-[12px] font-bold">
            <span className="text-gray-400">Seller</span> / Orders / Manage
            Orders
          </p>

          <div className="flex flex-1 justify-end items-center gap-2.5">
            <input
              type="text"
              name="searchText"
              id="searchText"
              value={searchText}
              placeholder="Search by order id"
              className="w-full max-w-[250px]  border border-gray-200 text-sm bg-white !px-4 !py-2 !rounded-none"
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="flex items-center gap-1 text-sm text-white bg-[var(--secondary)] px-5 py-2 transition-all duration-150 ease-linear hover:bg-[var(--secondary)]/70"
              onClick={handleSearch}
            >
              Search <LuSearch />
            </button>
          </div>
        </div>

        <p className="w-fit text-xs bg-yellow-100 text-yellow-500 px-2 py-0.5 mt-5">
          Gateway, Transaction ID and Transaction SS columns are for online
          payment purpose
        </p>

        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-xs text-left rtl:text-right text-gray-600">
            <thead className="text-[10px] text-[var(--secondary)] bg-[var(--secondary)]/5 uppercase border-b border-gray-200">
              <tr>
                <th scope="col" className="font-bold px-6 py-4">
                  Order ID
                </th>
                <th scope="col" className="font-bold px-6 py-4 whitespace-nowrap">
                  Payment Method
                </th>
                <th scope="col" className="font-bold px-6 py-4 whitespace-nowrap">
                  Gateway
                </th>
                <th scope="col" className="font-bold px-6 py-4 whitespace-nowrap">
                  Transaction ID
                </th>
                <th scope="col" className="font-bold px-6 py-4 whitespace-nowrap">
                  Transaction SS
                </th>
                <th scope="col" className="font-bold px-6 py-4 whitespace-nowrap">
                  Amount ({currency})
                </th>
                <th scope="col" className="font-bold px-6 py-4 whitespace-nowrap">
                  Status
                </th>
                <th scope="col" className="font-bold px-6 py-4 text-end">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr className="bg-white">
                  <td colSpan={8} className="py-20">
                    <div className="flex justify-center">
                      <div className="flex flex-col items-center gap-5">
                        <span className="w-8 h-8 rounded-full border-t-2 border-[var(--secondary)] animate-spin"></span>
                        <p>Loading...</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment._id} className="bg-white border-b border-gray-200">
                    <td className="px-6 py-4">{payment.orderID}</td>

                    <td className="px-6 py-4 uppercase">
                      {payment.paymentMethod || "_"}
                    </td>

                    <td className="px-6 py-4">{payment.gateway || "_"}</td>

                    <td className="px-6 py-4">{payment.transactionID || "_"}</td>
                    {/* transaction id and ss are only for online payments, so if they are empty it means it's a COD order, that's why we are showing "_" in case of empty value */}
                    <td className="px-6 py-4">
                      {payment.transactionSS ? (
                        <img
                          src={`${import.meta.env.VITE_HOST}${payment.transactionSS}`}
                          alt="Transaction Screenshot"
                          className="w-14 h-14 object-cover rounded border cursor-pointer"
                          onClick={() =>
                            window.open(
                              `${import.meta.env.VITE_HOST}${payment.transactionSS}`,
                              "_blank"
                            )
                          }
                        />
                      ) : (
                        "_"
                      )}
                    </td>

                    <td className="px-6 py-4 capitalize">{payment.amount}</td>

                    <td className="px-6 py-4 capitalize">
                      <div
                        className={`w-fit px-2 py-0.5 ${
                          payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-500"
                            : payment.status === "processing"
                            ? "bg-amber-100 text-amber-500"
                            : payment.status === "paid"
                            ? "bg-green-100 text-green-500"
                            : payment.status === "refunded" || payment.status === "failed"
                            ? "bg-red-100 text-red-500"
                            : ""
                        }`}
                      >
                        {payment.status}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2 items-center">
                        <MdOutlineEdit
                          className="text-[16px] text-blue-500 cursor-pointer hover:text-blue-300"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowUpdateModal(true);
                          }}
                        />
                        <RxTrash
                          className="text-[16px] text-red-500 cursor-pointer hover:text-red-300"
                          onClick={() => handleDeletePayment(payment._id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white">
                  <td colSpan={8} className="px-6 py-4 text-center text-red-500">
                    No payment found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex gap-2 mt-5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPage(p);
                  navigate(`?page=${p}`);
                }}
                className={`px-3 py-1 text-sm ${
                  page === p
                    ? "bg-[var(--secondary)] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Update Modal */}
        <div
          className={`flex justify-end fixed top-0 right-0 w-full bg-black/20 h-screen transition-all duration-200 ease-linear ${
            showUpdateModal ? "visible opacity-100" : "invisible opacity-0"
          }`}
          onClick={() => setShowUpdateModal(false)}
        >
          <div
            className={`flex flex-col justify-between w-full max-w-[400px] h-full bg-white transition-all duration-300 ease-linear ${
              showUpdateModal ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-b-gray-200">
              <p className="font-bold">Update Payment Status</p>
              <BiX
                className="text-2xl cursor-pointer"
                onClick={() => setShowUpdateModal(false)}
              />
            </div>

            <div className="flex-1 p-6">
              <label className="font-bold text-sm">Payment Status</label>
              <select
                name="status"
                id="status"
                value={selectedPayment?.status}
                onChange={(e) =>
                  setSelectedPayment((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full block p-2 mt-3 border border-gray-200"
              >
                <option value="" disabled>
                  Select a status
                </option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 p-6">
              <button
                className="px-4 py-1.5 bg-gray-100 text-gray-600"
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1.5 bg-[var(--secondary)] text-white"
                onClick={handleUpdatePaymentStatus}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
