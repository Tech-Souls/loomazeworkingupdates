// import axios from "axios";
// import React, { useCallback, useEffect, useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";
// import { message } from "antd";
// import { useSellerAuthContext } from "../../../contexts/SellerAuthContext";

// export default function Dashboard() {
//   const { user } = useSellerAuthContext();
//   console.log("user",user);

//   /* -------------------- STATES -------------------- */
//   const [sellers, setSellers] = useState([]);
//   const [invoices, setInvoices] = useState([]);
//   const [limit, setLimit] = useState(5);
//   const [sortField, setSortField] = useState("createdAt");
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("")
//   const [referrals, setReferrals] = useState([]);
//   const [overviewData, setOverviewData] = useState({ sales: {} });
//   const [settings, setSettings] = useState({ content: { currency: "" } });
//   const [loading, setLoading] = useState(false);
//   const [chartType, setChartType] = useState("sellers");
//   const [domains, setDomains] = useState([])
//   const [page, setPage] = useState(1);
//   const token = localStorage.getItem("ecomplatsellerjwt");

//   /* -------------------- API CALLS -------------------- */

//   const fetchOverviewData = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_HOST}/seller/dashboard/get-overview-data?sellerID=${user._id}`,
//       );
//       setOverviewData(res.data.overviewData || { sales: {} });
//     } catch {
//       setOverviewData({ sales: {} });
//     }
//   };

//   const fetchSettings = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_HOST}/seller/dashboard/fetch-settings?sellerID=${user._id}`,
//       );
//       setSettings(res.data.settings || { content: { currency: "" } });
//     } catch {
//       setSettings({ content: { currency: "" } });
//     }
//   };
// const fetchDomains = (page) => {
//         setLoading(true)
//         axios.get(`${import.meta.env.VITE_HOST}/admin/domains/all?page=${page}`)
//             .then(res => {
//                 const { status, data } = res
//                 if (status === 200) {
//                     setDomains(data?.domains || [])
//                 }
//             })
//             .catch(err => console.error('Frontend GET error', err.message))
//             .finally(() => setLoading(false))
//     }

//   const fetchSellers = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_HOST}/admin/sellers/list/all`,
//       );
//       setSellers(res.data?.sellers || []);
//     } catch {
//       setSellers([]);
//     }
//   };

//   const fetchReferrals = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${window.api}/referrals/admin/search`);
//       setReferrals(res.data.referrals || []);
//     } catch {
//       message.error("Failed to load referrals");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

  
//     const fetchInvoices = useCallback((params = {}) => {
//         setLoading(true);
//         axios.get(`${window.api}/payments/admin/invoices`, { headers: { Authorization: `Bearer ${token}`, }, params: { page: params.pageNum || page, search, limit: params.limitNum || limit, sortField: params.sortF || sortField, sortOrder: params.sortO || sortOrder, status: statusFilter, } })
//             .then((res) => {
//                 const { status, data } = res;
//                 if (status === 200) {
//                     setInvoices(data.data);
//                 }
//             }).catch((err) => {
//                 console.log('err :>> ', err);
//                 window.toastify("Failed to load invoices", "error");
//             }).finally(() => {
//                 setLoading(false);
//             })
//     }, [token, page, limit, sortField, sortOrder, search, statusFilter]);
//     const totalPaidAmount = invoices.reduce((sum, invoice) => {
//   return invoice.paymentStatus === "paid"
//     ? sum + invoice.amount
//     : sum;
// }, 0);

// console.log("Total Invoice Amount:", totalPaidAmount);
//     console.log("Invoices",invoices);
//   /* -------------------- EFFECTS -------------------- */

//   useEffect(() => {
//     if (!user?._id) return;
//     fetchOverviewData();
//     fetchSettings();
//     fetchSellers();
//     fetchInvoices();
//     fetchDomains(page);
//     fetchReferrals();
//   }, [user?._id, fetchReferrals,page]);

//   /* -------------------- CALCULATIONS -------------------- */

//   const approvedSellers = sellers.filter(s => s.status === "approved").length;
//   const pendingSellers = sellers.filter(s => s.status === "pending").length;

//   /* -------------------- CHART DATA -------------------- */

//   const chartDataMap = {
//     sellers: [
//       { name: "Approved", value: approvedSellers },
//       { name: "Pending", value: pendingSellers },
//     ],
//     sales: [
//       { name: "Completed", value: totalPaidAmount || 0 },
//     ],
//     domains: [
//       { name: "Domains", value: domains.length || 0 },
//     ],
//     referrals: [
//       { name: "Referrals", value: referrals.length },
//     ],
//   };

//   /* -------------------- UI -------------------- */

//   return (
//     <>
//       {/* Header */}
//       <div className="bg-[#fafafa] px-6 py-4">
//         <p className="font-bold text-gray-900">Dashboard</p>
//         <p className="text-sm text-gray-600">
//           Admin dashboard to monitor marketplace activity
//         </p>
//       </div>

//       <div className="admin-container">

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
//           <StatCard title="Sellers">
//             <Stat label="Approved" value={approvedSellers} />
//             <Stat label="Pending" value={pendingSellers} />
//           </StatCard>

//           <StatCard title="Sales">
//             <Stat
//               label="Completed"
//               value={`${settings.content.currency} ${totalPaidAmount|| 0}`}
//             />
//           </StatCard>

//           <StatCard title="Referrals">
//             <Stat label="Received" value={referrals.length} />
//           </StatCard>

//           <StatCard title="Domains">
//             <Stat label="Added" value={domains.length || 0} />
//           </StatCard>
//         </div>

//         {/* Chart */}
//         <div className="bg-white border p-6 mt-8 rounded-[10px]">
//           <div className="flex justify-between mb-4">
//             <h2 className="font-semibold capitalize">
//               {chartType} Analytics
//             </h2>
//             <select
//               value={chartType}
//               onChange={e => setChartType(e.target.value)}
//               className=" focus:outline-none border px-3 py-1 text-sm rounded-[5px]"
//             >
//               <option value="sellers">Sellers</option>
//               <option value="sales">Sales</option>
//               <option value="domains">Domains</option>
//               <option value="referrals">Referrals</option>
//             </select>
//           </div>

//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={chartDataMap[chartType]}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis allowDecimals={false} />
//               <Tooltip />
//               <Line dataKey="value" stroke="#3b82f6" strokeWidth={3} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </>
//   );
// }

// /* -------------------- REUSABLE COMPONENTS -------------------- */

// const StatCard = ({ title, children }) => (
//   <div className="bg-white p-6 border rounded-[10px]">
//     <p className="font-semibold">{title}</p>
//     <div className="mt-4 flex justify-between">{children}</div>
//   </div>
// );

// const Stat = ({ label, value }) => (
//   <div>
//     <p className="text-xs text-gray-600">{label}</p>
//     <p className="text-lg font-semibold">{value}</p>
//   </div>
// );
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { message } from "antd";
import { useSellerAuthContext } from "../../../contexts/SellerAuthContext";

export default function Dashboard() {
  const { user } = useSellerAuthContext();

  /* -------------------- STATES -------------------- */
  const [sellers, setSellers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [domains, setDomains] = useState([]);
  const [settings, setSettings] = useState({ content: { currency: "" } });
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState("sellers");
  const [page, setPage] = useState(1);

  const token = localStorage.getItem("ecomplatsellerjwt");

  /* -------------------- API CALLS -------------------- */

  const fetchSettings = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_HOST}/seller/dashboard/fetch-settings?sellerID=${user._id}`
      );
      setSettings(res.data.settings || { content: { currency: "" } });
    } catch {
      setSettings({ content: { currency: "" } });
    }
  };

  const fetchSellers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_HOST}/admin/sellers/list/all`
      );
      setSellers(res.data?.sellers || []);
    } catch {
      setSellers([]);
    }
  };

  const fetchDomains = page => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_HOST}/admin/domains/all?page=${page}`)
      .then(res => {
        if (res.status === 200) {
          setDomains(res.data?.domains || []);
        }
      })
      .finally(() => setLoading(false));
  };

  const fetchReferrals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${window.api}/referrals/admin/search`);
      setReferrals(res.data.referrals || []);
    } catch {
      message.error("Failed to load referrals");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInvoices = useCallback(() => {
    setLoading(true);
    axios
      .get(`${window.api}/payments/admin/invoices`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200) {
          setInvoices(res.data.data || []);
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  /* -------------------- EFFECTS -------------------- */

  useEffect(() => {
    if (!user?._id) return;
    fetchSettings();
    fetchSellers();
    fetchInvoices();
    fetchDomains(page);
    fetchReferrals();
  }, [user?._id, page, fetchReferrals]);

  /* -------------------- CALCULATIONS -------------------- */

  const approvedSellers = sellers.filter(s => s.status === "approved").length;
  const pendingSellers = sellers.filter(s => s.status === "pending").length;

  const totalPaidAmount = invoices.reduce(
    (sum, i) => (i.paymentStatus === "paid" ? sum + i.amount : sum),
    0
  );

  /* -------------------- CHART DATA -------------------- */

  const chartDataMap = {
    sellers: [
      { name: "Approved", value: approvedSellers },
      { name: "Pending", value: pendingSellers },
    ],
    sales: [{ name: "Completed", value: totalPaidAmount }],
    domains: [{ name: "Domains", value: domains.length }],
    referrals: [{ name: "Referrals", value: referrals.length }],
  };

  /* -------------------- UI -------------------- */

  return (
    <>
      <div className="bg-[#fafafa] px-6 py-4">
        <p className="font-bold">Dashboard</p>
        <p className="text-sm text-gray-600">
          Admin dashboard to monitor marketplace activity
        </p>
      </div>

      <div className="admin-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <StatCard title="Sellers">
            <Stat label="Approved" value={approvedSellers} />
            <Stat label="Pending" value={pendingSellers} />
          </StatCard>

          <StatCard title="Sales">
            <Stat
              label="Completed"
              value={`${settings.content.currency} ${totalPaidAmount}`}
            />
          </StatCard>

          <StatCard title="Referrals">
            <Stat label="Received" value={referrals.length} />
          </StatCard>

          <StatCard title="Domains">
            <Stat label="Added" value={domains.length} />
          </StatCard>
        </div>

        <div className="bg-white border p-6 mt-8 rounded-[10px]">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold capitalize">{chartType} Analytics</h2>
            <select
              value={chartType}
              onChange={e => setChartType(e.target.value)}
              className="border px-3 py-1 text-sm rounded-[5px]"
            >
              <option value="sellers">Sellers</option>
              <option value="sales">Sales</option>
              <option value="domains">Domains</option>
              <option value="referrals">Referrals</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartDataMap[chartType]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line dataKey="value" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

/* -------------------- REUSABLE COMPONENTS -------------------- */

const StatCard = ({ title, children }) => (
  <div className="bg-white p-6 border rounded-[10px]">
    <p className="font-semibold">{title}</p>
    <div className="mt-4 flex justify-between">{children}</div>
  </div>
);

const Stat = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-600">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);