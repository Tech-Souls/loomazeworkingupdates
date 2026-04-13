// import { useState, useEffect } from "react";
// import { Typography, Upload, Button, Badge } from "antd";
// import {
//   CloudUploadOutlined,
//   CheckCircleFilled,
//   InfoCircleOutlined,
// } from "@ant-design/icons";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const { Title, Text, Paragraph } = Typography;
// const { Dragger } = Upload;
// const bank = {
//   title: "Loomaze",
//   name: "Meezan",
//   acountNumber: "04020113972145",
//   iban: "PK25MEZN0004020113972145",
// };
// const plans = [
//   { name: "Basic", amount: 2000 },
//   { name: "Grow", amount: 4000 },
// ];

// export default function DepositForm() {
//   const navigate = useNavigate();
//   const [amount, setAmount] = useState(4000);
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [planName, setPlanName] = useState("");
//   const [plans, setPlans] = useState([]);
//   const [fetchingPlans, setFetchingPlans] = useState(false);
//   const token = localStorage.getItem("ecomplatsellerjwt");
//   const [currentPlan, setCurrentPlan] = useState(null);
//   const [showPlanModal, setShowPlanModal] = useState(false);
//   const [planActive, setPlanActive] = useState(false);

//   const params = new URLSearchParams(window.location.search);
//   const isExtend = params.get("extend") === "true";
//   const isUpgrade = params.get("upgrade") === "true";

//   const getAuthHeader = () => {
//     const token =
//       localStorage.getItem("ecomplatsellerjwt") ||
//       localStorage.getItem("ecomplatadmintoken") ||
//       localStorage.getItem("ecomplatadminjwt") ||
//       null;
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   };

//   const parsePlansResponse = (data) => {
//     if (!data) return [];
//     if (Array.isArray(data)) return data;
//     if (Array.isArray(data.plans)) return data.plans;
//     if (data.plans && typeof data.plans === "object")
//       return Object.keys(data.plans).reduce((acc, k) => {
//         acc.push({ name: k, ...data.plans[k] });
//         return acc;
//       }, []);
//     return [];
//   };

//   // fetch plans (seller view)
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       setFetchingPlans(true);
//       try {
//         const res = await axios.get(`${window.api}/plans/seller`, {
//           headers: getAuthHeader(),
//         });
//         if (!mounted) return;
//         const parsed = parsePlansResponse(res.data).map((p) => ({
//           name: String(p.name || "").trim(),
//           price: Number(p.price ?? 0),
//           durationDays: Number(p.durationDays ?? 30),
//           referralBonusPercent: Number(p.referralBonusPercent ?? 0),
//           signUpBonusPercent: Number(p.signUpBonusPercent ?? 0),
//           isActive: Boolean(p.isActive ?? true),
//         }));
//         setPlans(parsed);
//       } catch (err) {
//         console.error("Error fetching seller plans:", err);
//         setPlans([]);
//       } finally {
//         if (mounted) setFetchingPlans(false);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // useEffect(() => {
//   //   const fetchPlan = async () => {
//   //     try {
//   //       const token = localStorage.getItem("ecomplatsellerjwt");

//   //       const res = await axios.get(`${window.api}/seller/check-Plan`, {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       });
//   //       console.log("Plan details:", res.data.plan);
//   //       const isActive =
//   //         res.data.plan?.subscriptionStatus === "active" &&
//   //         new Date(res.data.plan.endDate) > new Date();
//   //       setPlanActive(isActive);
//   //       if (isActive) {
//   //         setCurrentPlan(res.data.plan);
//   //         setPlanName(res.data.plan.plan);
//   //         setAmount((res.data.plan.plan).toLowerCase() === "grow" ? 4000 : 2000);
//   //         if (isUpgrade) {
//   //           setAmount(4000);
//   //           setPlanName("Grow");
//   //         }
//   //       }

//   //       if (isActive && !isExtend && !isUpgrade) {
//   //         setShowPlanModal(true);
//   //       } else {
//   //         setShowPlanModal(false);
//   //       }
//   //     } catch (err) {
//   //       console.error("Error fetching plan:", err);
//   //       setPlanActive(false);
//   //       setShowPlanModal(false);
//   //     }
//   //   };
//   //   fetchPlan();
//   // }, [isExtend, isUpgrade]);

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       setFetchingCurrent(true);
//       try {
//         const res = await axios.get(`${window.api}/seller/check-Plan`, {
//           headers: getAuthHeader(),
//         });
//         if (!mounted) return;
//         const plan = res.data?.plan ?? null;
//         const active =
//           plan &&
//           plan.subscriptionStatus === "active" &&
//           plan.endDate &&
//           new Date(plan.endDate) > new Date();
//         setCurrentPlan(plan);
//         setPlanActive(Boolean(active));
//       } catch (err) {
//         console.error("Error fetching current plan:", err);
//         setCurrentPlan(null);
//         setPlanActive(false);
//       } finally {
//         if (mounted) setFetchingCurrent(false);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, [isExtend, isUpgrade]);

//   useEffect(() => {
//     if (isExtend && currentPlan) {
//       setPlanName(currentPlan.plan);
//       setAmount(currentPlan.plan === "Grow" ? 4000 : 2000);
//     }
//   }, [isExtend, currentPlan, isUpgrade]);

//   const submitPayment = async () => {
//     if (!file)
//       return window.toastify("Please upload payment receipt", "warning");

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("plan", planName);
//     formData.append("amount", amount);
//     formData.append("receipt", file);

//     axios
//       .post(`${window.api}/payments/submit`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         const { status } = res;
//         if (status === 201) {
//           window.toastify(
//             "Payment submitted. Waiting for admin approval.",
//             "success",
//           );
//           setFile(null);
//         }
//       })
//       .catch((err) => {
//         window.toastify(
//           err.response?.data?.message || "Submission failed",
//           "error",
//         );
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const extendPlan = () => {
//     if (!file)
//       return window.toastify("Please upload payment receipt", "warning");

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("plan", planName);
//     formData.append("amount", amount);
//     formData.append("receipt", file);
//     formData.append("type", "extend");

//     axios
//       .post(`${window.api}/payments/submit?extend=true`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         const { status } = res;
//         if (status === 201) {
//           window.toastify(
//             "Payment submitted. Waiting for admin approval.",
//             "success",
//           );
//           setFile(null);
//         }
//       })
//       .catch((err) => {
//         window.toastify(
//           err.response?.data?.message || "Submission failed",
//           "error",
//         );
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const upgradePlan = () => {
//     if (!file)
//       return window.toastify("Please upload payment receipt", "warning");

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("plan", "Grow");
//     formData.append("amount", 4000);
//     formData.append("receipt", file);
//     formData.append("type", "upgrade");

//     axios
//       .post(`${window.api}/payments/submit?upgrade=true`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         const { status } = res;
//         if (status === 201) {
//           window.toastify(
//             "Payment submitted. Waiting for admin approval.",
//             "success",
//           );
//           setFile(null);
//         }
//       })
//       .catch((err) => {
//         window.toastify(
//           err.response?.data?.message || "Submission failed",
//           "error",
//         );
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   return (
//     <div className="min-h-screen bg-[#f4f7fe] flex justify-center p-10">
//       <div className="w-[800px] bg-white rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.05)] p-8">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <Title level={3} className="mb-0!">
//               Secure Deposit
//             </Title>
//             <Text type="secondary">
//               Follow the steps below to fund your account
//             </Text>
//           </div>
//           <Badge status="processing" text="Verified Merchant" />
//         </div>
//         <div className="flex gap-10">
//           <div className="flex-1 space-y-6">
//             <Text strong>1. Select Plan</Text>
//             <div className="flex gap-3 ">
//               {plans.map((plan) => (
//                 <button
//                   key={plan.name}
//                   onClick={() => {
//                     setAmount(plan.amount);
//                     setPlanName(plan.name);
//                   }}
//                   className={`px-6 py-2 rounded-full border transition ${amount === plan.amount ? "bg-primary text-white border-none" : "bg-white border-gray-300 hover:border-primary hover:text-primary"} `}
//                   // disabled={(planActive && plan.name === "Grow")}
//                   // i also want to disable this button if current plan is basic and active and user want to upgrade to grow without extending
//                   disabled={
//                     (planActive && plan.name === "Grow") ||
//                     (planActive && currentPlan?.plan === "Basic" && isUpgrade)
//                   }
//                 >
//                   {plan.name}
//                 </button>
//               ))}
//             </div>
//             <div className="border rounded-lg p-4 space-y-2">
//               <div className="flex justify-between">
//                 <Text type="secondary">Selected Plan</Text>
//                 <Text>{planName}</Text>
//               </div>
//               <div className="flex justify-between">
//                 <Text type="secondary">Subtotal</Text>
//                 <Text>{amount} PKR</Text>
//               </div>
//               <div className="flex justify-between">
//                 <Text type="secondary">Fee</Text>
//                 <Text className="text-green-500!">0 PKR</Text>
//               </div>
//               <div className="border-t pt-2 flex justify-between">
//                 <Text strong>Payable</Text>
//                 <Text strong>{amount} PKR</Text>
//               </div>
//             </div>
//           </div>

//           <div className="flex-1 space-y-4">
//             <Text strong>2. Beneficiary Details</Text>
//             <div className="rounded-xl p-6 text-white bg-gradient-to-br from-primary to-primary-light shadow-lg space-y-5">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
//                   <CheckCircleFilled className="text-white! text-xl!" />
//                 </div>
//                 <Text className="text-white/80! text-sm!">
//                   Verified Merchant Account
//                 </Text>
//               </div>
//               <div className="space-y-3 pt-2">
//                 <div className="flex justify-between items-center">
//                   <Text className="text-white! text-sm!">Title</Text>
//                   <Text className="text-white! font-medium!">{bank.title}</Text>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <Text className="text-white! text-sm!">Bank</Text>
//                   <Text className="text-white! font-medium!">{bank.name}</Text>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <Text className="text-white! text-sm!">Account Number</Text>
//                   <Paragraph
//                     copyable={{ text: bank.acountNumber }}
//                     className="m-0! text-white! font-mono!"
//                   >
//                     {bank.acountNumber}
//                   </Paragraph>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <Text className="text-white! text-sm!">IBAN</Text>
//                   <Paragraph
//                     copyable={{ text: bank.iban }}
//                     className="m-0! text-white! font-mono!"
//                   >
//                     {bank.iban}
//                   </Paragraph>
//                 </div>
//               </div>
//               <div className="pt-3 border-t border-white/20 text-white/70 text-xs">
//                 Use these details to transfer funds via bank or mobile app
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-10! space-y-5!">
//           <Text strong>3. Upload Proof</Text>
//           <Dragger
//             beforeUpload={(f) => (setFile(f), false)}
//             maxCount={1}
//             className="border! border-dashed! border-primary! rounded-lg!"
//           >
//             <CloudUploadOutlined className="text-3xl! text-primary!" />
//             <p>Upload bank payment receipt</p>
//           </Dragger>

//           <Button
//             type="primary"
//             size="large"
//             loading={loading}
//             // onClick={isExtend ? extendPlan : submitPayment}
//             onClick={
//               isExtend ? extendPlan : isUpgrade ? upgradePlan : submitPayment
//             }
//             className="w-full! bg-primary! mt-8!"
//             // disabled={planActive && planName === "Grow" && !isExtend}
//             disabled={planActive && !isExtend && !isUpgrade}
//           >
//             Complete Deposit
//           </Button>
//           <div className="flex! justify-center! gap-2! text-gray-500!">
//             <InfoCircleOutlined />
//             <Text type="secondary">Manual verification may take 1–2 days</Text>
//           </div>
//         </div>
//       </div>
//       {showPlanModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">
//             <h2 className="text-lg font-bold mb-2">Plan Already Active</h2>

//             <p className="text-gray-600 mb-2">
//               You already have an active plan:{" "}
//               <strong>{currentPlan?.plan}</strong>
//             </p>
//             <p className="text-sm text-gray-500 mb-4">
//               Plan expiry: {new Date(currentPlan?.endDate).toDateString()}
//             </p>

//             {/* <div className="flex justify-end gap-3"> */}
//             <div className="">
//               <button
//                 onClick={() => setShowPlanModal(false)}
//                 className="px-4 py-2 border rounded mr-6 mb-6"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={() => {
//                   setShowPlanModal(false);
//                   navigate("/seller/loomaze-plan/deposit?extend=true");
//                 }}
//                 className="px-4 py-2 bg-primary text-white rounded"
//               >
//                 Extend Plan
//               </button>
//               {currentPlan.plan !== "Grow" && (
//                 <button
//                   onClick={() => {
//                     setShowPlanModal(false);
//                     navigate("/seller/loomaze-plan/deposit?upgrade=true");
//                   }}
//                   className="px-4 py-2 bg-primary text-white rounded"
//                 >
//                   Upgrade to Grow
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import { Typography, Upload, Button, Badge, Spin } from "antd";
import {
  CloudUploadOutlined,
  CheckCircleFilled,
  InfoCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

const bank = {
  title: "Loomaze",
  name: "Meezan",
  acountNumber: "04020113972145",
  iban: "PK25MEZN0004020113972145",
};

export default function DepositForm() {
  const navigate = useNavigate();

  // data from backend
  const [plans, setPlans] = useState([]);
  const [fetchingPlans, setFetchingPlans] = useState(true);
  const [fetchingCurrent, setFetchingCurrent] = useState(true);

  // UI state
  const [planName, setPlanName] = useState("");
  const [amount, setAmount] = useState(0);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // current subscription
  const [currentPlan, setCurrentPlan] = useState(null);
  const [planActive, setPlanActive] = useState(false);

  // flow action: null = not chosen yet (modal open), 'extend', 'upgrade', 'cancel', 'buy'
  const [action, setAction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // query flags (we don't rely on them for modal auto-open per your spec)
  const params = new URLSearchParams(window.location.search);
  const urlExtend = params.get("extend") === "true";
  const urlUpgrade = params.get("upgrade") === "true";

  const getAuthHeader = () => {
    const token =
      localStorage.getItem("ecomplatsellerjwt") ||
      localStorage.getItem("ecomplatadmintoken") ||
      localStorage.getItem("ecomplatadminjwt") ||
      null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const safeLower = (v) => (typeof v === "string" ? v.toLowerCase() : "");

  const parsePlansResponse = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.plans)) return data.plans;
    if (data.plans && typeof data.plans === "object")
      return Object.keys(data.plans).reduce((acc, k) => {
        acc.push({ name: k, ...data.plans[k] });
        return acc;
      }, []);
    return [];
  };

  // Fetch plans available to sellers (active ones)
  useEffect(() => {
    let mounted = true;
    (async () => {
      setFetchingPlans(true);
      try {
        const res = await axios.get(`${window.api}/plans/seller`, {
          headers: getAuthHeader(),
        });
        if (!mounted) return;
        const raw = parsePlansResponse(res.data);
        const normalized = raw.map((p) => ({
          name: String(p.name || "").trim(),
          price: Number(p.price ?? 0),
          durationDays: Number(p.durationDays ?? 30),
          referralBonusPercent: Number(p.referralBonusPercent ?? 0),
          signUpBonusPercent: Number(p.signUpBonusPercent ?? 0),
          isActive: Boolean(p.isActive ?? true),
        }));
        setPlans(normalized);
      } catch (err) {
        console.error("Error fetching seller plans:", err);
        setPlans([]);
      } finally {
        if (mounted) setFetchingPlans(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch current seller subscription/plan
  useEffect(() => {
    let mounted = true;
    (async () => {
      setFetchingCurrent(true);
      try {
        const res = await axios.get(`${window.api}/seller/check-Plan`, {
          headers: getAuthHeader(),
        });
        if (!mounted) return;
        const p = res.data?.plan ?? null;
        const active =
          p &&
          p.subscriptionStatus === "active" &&
          p.endDate &&
          new Date(p.endDate) > new Date();
        setCurrentPlan(p);
        setPlanActive(Boolean(active));
      } catch (err) {
        console.error("Error fetching current plan:", err);
        setCurrentPlan(null);
        setPlanActive(false);
      } finally {
        if (mounted) setFetchingCurrent(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Decide initial selection and modal open; ensure "bought one is selected"
  useEffect(() => {
    // wait until both fetches finished
    if (fetchingPlans || fetchingCurrent) return;

    if (planActive && currentPlan) {
      // bought one selected by default
      const matched = plans.find(
        (x) => safeLower(x.name) === safeLower(currentPlan.plan)
      );
      setPlanName(matched ? matched.name : String(currentPlan.plan || ""));
      setAmount(matched ? matched.price : 0);

      // open modal asking for action (extend/upgrade/close)
      setShowModal(true);
      setAction(null); // user hasn't chosen extend/upgrade yet
      return;
    }

    // not subscribed => buy flow; pick first available plan by default
    const first = plans[0];
    setPlanName(first ? first.name : "");
    setAmount(first ? first.price : 0);
    setShowModal(false);
    setAction("buy");
  }, [plans, currentPlan, planActive, fetchingPlans, fetchingCurrent]);

  // Helpers for enabling/disabling UI according to action
  const onlyCurrentSelected = () => action === "extend";
  const onlyGrowSelected = () => action === "upgrade";
  const cancelMode = () => action === "cancel";
  const buyMode = () => action === "buy" && !planActive;

  // Disable plan buttons depending on current action and subscription
  const isPlanButtonDisabled = (p) => {
    if (!planActive) return false; // user not subscribed -> can pick any
    // if modal open and user hasn't chosen an action, disable selection (they must pick modal option)
    if (showModal && action === null) return true;
    // after modal: extend -> only current plan selectable
    if (onlyCurrentSelected()) {
      return safeLower(p.name) !== safeLower(currentPlan?.plan || "");
    }
    // after modal: upgrade -> only grow selectable
    if (onlyGrowSelected()) {
      return safeLower(p.name) !== "grow";
    }
    // after modal: cancel -> user can select any plan but deposit button disabled
    if (cancelMode()) return false;
    // if modal closed but user has active plan and didn't pick extend/upgrade (e.g. modal closed by user previously)
    // per spec: when seller has active plan and clicked Close, they can select any plan but deposit disabled
    if (!showModal && planActive && action === "cancel") return false;
    // default: allow selection
    return false;
  };

  // When plan selection changes, update amount
  useEffect(() => {
    const matched = plans.find((p) => safeLower(p.name) === safeLower(planName));
    setAmount(matched ? matched.price : 0);
  }, [planName, plans]);

  // Validation for submission
  const validateReceipt = () => {
    if (!file) {
      window.toastify?.("Please upload payment receipt", "warning");
      return false;
    }
    if (!planName) {
      window.toastify?.("No plan selected", "error");
      return false;
    }
    return true;
  };

  // API calls (buy / extend / upgrade)
  const buySubmit = async () => {
    if (!validateReceipt()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("plan", planName);
      fd.append("amount", amount);
      fd.append("receipt", file);
      const res = await axios.post(`${window.api}/payments/submit`, fd, {
        headers: getAuthHeader(),
      });
      if (res.status === 201) {
        window.toastify?.("Payment submitted. Waiting for admin approval.", "success");
        setFile(null);
      }
    } catch (err) {
      console.error("buySubmit error:", err);
      window.toastify?.(err.response?.data?.message || "Submission failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const extendSubmit = async () => {
    if (!validateReceipt()) return;
    // ensure user actually extending current plan
    if (!planActive || safeLower(planName) !== safeLower(currentPlan?.plan)) {
      window.toastify?.("You can only extend your current active plan", "error");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("plan", planName);
      fd.append("amount", amount);
      fd.append("receipt", file);
      fd.append("type", "extend");
      const res = await axios.post(`${window.api}/payments/submit?extend=true`, fd, {
        headers: getAuthHeader(),
      });
      if (res.status === 201) {
        window.toastify?.("Extend request submitted. Waiting for admin approval.", "success");
        setFile(null);
      }
    } catch (err) {
      console.error("extendSubmit error:", err);
      window.toastify?.(err.response?.data?.message || "Submission failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const upgradeSubmit = async () => {
    if (!validateReceipt()) return;
    // allow upgrade only Basic -> Grow when seller has active Basic; if seller had no plan we allow buying Grow as upgrade
    if (planActive && safeLower(currentPlan?.plan || "") !== "basic") {
      window.toastify?.("Upgrade allowed only from Basic → Grow", "error");
      return;
    }
    const growPlan = plans.find((p) => safeLower(p.name) === "grow");
    if (!growPlan) {
      window.toastify?.("Grow plan not available", "error");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("plan", growPlan.name);
      fd.append("amount", growPlan.price);
      fd.append("receipt", file);
      fd.append("type", "upgrade");
      const res = await axios.post(`${window.api}/payments/submit?upgrade=true`, fd, {
        headers: getAuthHeader(),
      });
      if (res.status === 201) {
        window.toastify?.("Upgrade request submitted. Waiting for admin approval.", "success");
        setFile(null);
      }
    } catch (err) {
      console.error("upgradeSubmit error:", err);
      window.toastify?.(err.response?.data?.message || "Submission failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // Complete Deposit click: dispatch according to current action/state
  const handleCompleteDeposit = () => {
    // If seller had active plan and hasn't chosen an action (modal not answered) -> block
    if (planActive && action === null) {
      window.toastify?.("Please select Extend or Upgrade from the modal", "warning");
      return;
    }
    // If seller clicked Close (cancel) previously -> deposit disabled
    if (action === "cancel" && planActive) {
      window.toastify?.("Deposit disabled after closing modal. Choose Extend/Upgrade to proceed.", "info");
      return;
    }

    // Decide which API to call
    if (action === "extend") return extendSubmit();
    if (action === "upgrade") return upgradeSubmit();
    // buy route (no current plan)
    return buySubmit();
  };

  // Modal action handlers
  const handleModalExtend = () => {
    // set mode to extend: select current plan, disable others
    setAction("extend");
    setShowModal(false);
    const cpName = currentPlan?.plan || "";
    // prefer exact server plan name from plans list if exists
    const match = plans.find((p) => safeLower(p.name) === safeLower(cpName));
    setPlanName(match ? match.name : cpName);
    setAmount(match ? match.price : 0);
  };

  const handleModalUpgrade = () => {
    // set mode to upgrade: select grow, disable basic
    setAction("upgrade");
    setShowModal(false);
    const grow = plans.find((p) => safeLower(p.name) === "grow");
    if (grow) {
      setPlanName(grow.name);
      setAmount(grow.price);
    } else {
      // fallback: set planName to "grow"
      setPlanName("grow");
      setAmount(0);
    }
  };

  const handleModalClose = () => {
    // close modal, let user pick but disable deposit button
    setAction("cancel");
    setShowModal(false);
    // selection remains on bought plan (per spec "bought one is already selected")
    // user may change selection but deposit will remain disabled until they choose Extend/Upgrade
  };

  // UI: whether Complete Deposit should be enabled
  const isCompleteEnabled = () => {
    // if no current plan (buy flow) -> enabled
    if (!planActive) return true;
    // if user selected extend/upgrade -> enabled
    if (action === "extend" || action === "upgrade") return true;
    // otherwise (action null or cancel) -> disabled
    return false;
  };

  // show spinner while loading plans
  if (fetchingPlans) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <Spin tip="Loading plans..." />
      </div>
    );
  }

  // render
  return (
    <div className="min-h-screen bg-[#f4f7fe] flex justify-center p-10">
      <div className="w-[800px] bg-white rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.05)] p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Title level={3} className="mb-0!">Secure Deposit</Title>
            <Text type="secondary">Follow the steps below to fund your account</Text>
          </div>
          <Badge status="processing" text="Verified Merchant" />
        </div>

        <div className="flex gap-10">
          <div className="flex-1 space-y-6">
            <Text strong>1. Select Plan</Text>
            <div className="flex gap-3 ">
              {plans.length === 0 ? (
                <div className="text-sm text-gray-500">No plans available</div>
              ) : (
                plans.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => {
                      setPlanName(p.name);
                      setAmount(p.price);
                      // if user picks a different plan after close/cancel, we keep action as 'cancel' (deposit disabled)
                      // they must use modal Extend/Upgrade to enable deposit if they had active plan
                    }}
                    className={`px-6 py-2 rounded-full border transition ${
                      amount === p.price ? "bg-primary text-white border-none" : "bg-white border-gray-300 hover:border-primary hover:text-primary"
                    }`}
                    disabled={isPlanButtonDisabled(p)}
                    title={isPlanButtonDisabled(p) ? "Disabled by current flow" : ""}
                  >
                    {String(p.name).charAt(0).toUpperCase() + String(p.name).slice(1)}
                  </button>
                ))
              )}
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <Text type="secondary">Selected Plan</Text>
                <Text>{planName || "—"}</Text>
              </div>
              <div className="flex justify-between">
                <Text type="secondary">Subtotal</Text>
                <Text>{amount} PKR</Text>
              </div>
              <div className="flex justify-between">
                <Text type="secondary">Fee</Text>
                <Text className="text-green-500!">0 PKR</Text>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <Text strong>Payable</Text>
                <Text strong>{amount} PKR</Text>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <Text strong>2. Beneficiary Details</Text>
            <div className="rounded-xl p-6 text-white bg-gradient-to-br from-primary to-primary-light shadow-lg space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircleFilled className="text-white! text-xl!" />
                </div>
                <Text className="text-white/80! text-sm!">Verified Merchant Account</Text>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <Text className="text-white! text-sm!">Title</Text>
                  <Text className="text-white! font-medium!">{bank.title}</Text>
                </div>
                <div className="flex justify-between items-center">
                  <Text className="text-white! text-sm!">Bank</Text>
                  <Text className="text-white! font-medium!">{bank.name}</Text>
                </div>
                <div className="flex justify-between items-center">
                  <Text className="text-white! text-sm!">Account Number</Text>
                  <Paragraph copyable={{ text: bank.acountNumber }} className="m-0! text-white! font-mono!">
                    {bank.acountNumber}
                  </Paragraph>
                </div>
                <div className="flex justify-between items-center">
                  <Text className="text-white! text-sm!">IBAN</Text>
                  <Paragraph copyable={{ text: bank.iban }} className="m-0! text-white! font-mono!">
                    {bank.iban}
                  </Paragraph>
                </div>
              </div>

              <div className="pt-3 border-t border-white/20 text-white/70 text-xs">Use these details to transfer funds via bank or mobile app</div>
            </div>
          </div>
        </div>

        <div className="mt-10! space-y-5!">
          <Text strong>3. Upload Proof</Text>
          <Dragger
            beforeUpload={(f) => {
              setFile(f);
              return false;
            }}
            maxCount={1}
            className="border! border-dashed! border-primary! rounded-lg!"
          >
            <CloudUploadOutlined className="text-3xl! text-primary!" />
            <p>Upload bank payment receipt</p>
          </Dragger>

          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handleCompleteDeposit}
            className="w-full! bg-primary! mt-8!"
            disabled={!isCompleteEnabled()}
          >
            Complete Deposit
          </Button>

          <div className="flex! justify-center! gap-2! text-gray-500! mt-2">
            <InfoCircleOutlined />
            <Text type="secondary">Manual verification may take 1–2 days</Text>
          </div>
        </div>
      </div>

      {/* Modal behaviour implemented inline */}
      {showModal && planActive && currentPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">
            <h2 className="text-lg font-bold mb-2">Plan Already Active</h2>

            <p className="text-gray-600 mb-2">
              You already have an active plan: <strong>{currentPlan?.plan}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Plan expiry: {currentPlan?.endDate ? new Date(currentPlan.endDate).toDateString() : "—"}
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 border rounded"
              >
                Close
              </button>

              <button
                onClick={handleModalExtend}
                className="px-4 py-2 bg-primary text-white rounded"
              >
                Extend
              </button>

              {safeLower(currentPlan?.plan) !== "grow" && (
                <button
                  onClick={handleModalUpgrade}
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  Upgrade to Grow
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
