

// import React, { useEffect, useState } from "react";
// import axios from "axios";


// export default function AdminPlans() {
//   const [plans, setPlans] = useState(null); // original from server
//   const [form, setForm] = useState(null); // editable copy
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);

//   // Try common token keys (adjust to your app)
//   const getAuthHeader = () => {
//     const token =
//       localStorage.getItem("ecomplatadminjwt") ||
//       localStorage.getItem("ecomplatadmintoken") ||
//       localStorage.getItem("ecomplatsellerjwt") ||
//       null;
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   };

//   useEffect(() => {
//     const fetchPlans = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await axios.get(`${window.api}/plans/admin`, {
//           headers: getAuthHeader(),
//         });
//         console.log("Fetched plans:", res.data);
//         const remotePlans = res.data?.plans || res.data; // support both shapes
//         setPlans(remotePlans);
//         // create editable copy with numbers normalized
//         const normalized = {};
//         Object.keys(remotePlans).forEach((k) => {
//           const p = remotePlans[k] || {};
//           normalized[k] = {
//             price: Number(p.price ?? 0),
//             durationDays: Number(p.durationDays ?? 30),
//             referralBonusPercent: Number(p.referralBonusPercent ?? 0),
//           };
//         });
//         setForm(normalized);
//       } catch (err) {
//         console.error("Fetch plans error:", err);
//         setError(err.response?.data?.message || err.message || "Failed to load plans");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlans();
//   }, []);

//   const handleChange = (planName, field, value) => {
//     // keep numeric fields numeric
//     setForm((prev) => ({
//       ...prev,
//       [planName]: {
//         ...prev[planName],
//         [field]: value,
//       },
//     }));
//   };

//   const validate = () => {
//     if (!form) return "No form data";
//     for (const planName of Object.keys(form)) {
//       const p = form[planName];
//       if (p.price == null || Number.isNaN(Number(p.price)) || Number(p.price) <= 0) {
//         return `${planName}: price must be greater than 0`;
//       }
//       if (
//         p.durationDays == null ||
//         Number.isNaN(Number(p.durationDays)) ||
//         Number(p.durationDays) < 1
//       ) {
//         return `${planName}: durationDays must be at least 1`;
//       }
//       if (
//         p.referralBonusPercent == null ||
//         Number.isNaN(Number(p.referralBonusPercent)) ||
//         p.referralBonusPercent < 0 ||
//         p.referralBonusPercent > 100
//       ) {
//         return `${planName}: referralBonusPercent must be between 0 and 100`;
//       }
//     }
//     return null;
//   };

//   const handleSave = async () => {
//     const v = validate();
//     if (v) {
//       if (window.toastify) window.toastify(v, "error");
//       else alert(v);
//       return;
//     }

//     setSaving(true);
//     try {
//       // Prepare payload: keep the same shape as DB expects
//       // Convert string numbers to proper numbers
//       const payload = { plans: {} };
//       Object.keys(form).forEach((k) => {
//         payload.plans[k] = {
//           price: Number(form[k].price),
//           durationDays: Number(form[k].durationDays),
//           referralBonusPercent: Number(form[k].referralBonusPercent),
//         };
//       });

//       const res = await axios.put(`${window.api}/plans/admin`, payload, {
//         headers: {
//           "Content-Type": "application/json",
//           ...getAuthHeader(),
//         },
//       });

//       const updated = res.data?.plans || form;
//       setPlans(updated);
//       setForm(
//         Object.keys(updated).reduce((acc, k) => {
//           const p = updated[k];
//           acc[k] = {
//             price: Number(p.price ?? 0),
//             durationDays: Number(p.durationDays ?? 30),
//             referralBonusPercent: Number(p.referralBonusPercent ?? 0),
//           };
//           return acc;
//         }, {})
//       );

//       if (window.toastify) window.toastify("Plan settings updated", "success");
//       else alert("Plan settings updated");
//     } catch (err) {
//       console.error("Save plans error:", err);
//       const msg = err.response?.data?.message || err.message || "Failed to save plans";
//       if (window.toastify) window.toastify(msg, "error");
//       else alert(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleReset = () => {
//     // reset form to last fetched plans
//     if (!plans) return;
//     const normalized = {};
//     Object.keys(plans).forEach((k) => {
//       const p = plans[k] || {};
//       normalized[k] = {
//         price: Number(p.price ?? 0),
//         durationDays: Number(p.durationDays ?? 30),
//         referralBonusPercent: Number(p.referralBonusPercent ?? 0),
//       };
//     });
//     setForm(normalized);
//     if (window.toastify) window.toastify("Form reset", "info");
//   };

//   if (loading) {
//     return (
//       <div className="min-h-[200px] flex items-center justify-center">
//         <div className="text-gray-500">Loading plans…</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 bg-white rounded shadow">
//         <div className="text-red-600 font-medium mb-2">Failed to load plans</div>
//         <div className="text-sm text-gray-600 mb-4">{error}</div>
//         <button
//           onClick={() => window.location.reload()}
//           className="px-4 py-2 bg-primary text-white rounded"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   if (!form) {
//     return null;
//   }

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Plans configuration</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {Object.keys(form).map((planName) => {
//           const p = form[planName];
//           return (
//             <div key={planName} className="p-6 bg-white rounded-xl shad">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-semibold">{planName}</h3>
//                 <div className="text-sm text-gray-500">Editable</div>
//               </div>

//               <div className="space-y-4">
//                 <label className="text-sm text-gray-600">Price (PKR)</label>
//                 <input
//                   type="number"
//                   min="1"
//                   value={p.price}
//                   onChange={(e) =>
//                     handleChange(planName, "price", e.target.value === "" ? "" : Number(e.target.value))
//                   }
//                   className="w-full"
//                 />

//                 <label className="text-sm text-gray-600">Duration (days)</label>
//                 <input
//                   type="number"
//                   min="1"
//                   value={p.durationDays}
//                   onChange={(e) =>
//                     handleChange(planName, "durationDays", e.target.value === "" ? "" : Number(e.target.value))
//                   }
//                   className="w-full"
//                 />

//                 <label className="text-sm text-gray-600">Referral Bonus (%)</label>
//                 <input
//                   type="number"
//                   min="0"
//                   max="100"
//                   value={p.referralBonusPercent}
//                   onChange={(e) =>
//                     handleChange(
//                       planName,
//                       "referralBonusPercent",
//                       e.target.value === "" ? "" : Number(e.target.value)
//                     )
//                   }
//                   className="w-full"
//                 />
//               </div>

//               <div className="mt-6 flex items-center justify-between">
//                 <div className="text-sm text-gray-500">
//                   Current server price: <strong>{plans[planName]?.price ?? "-"} PKR</strong>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => {
//                       // reset single plan to server value
//                       const newForm = { ...form };
//                       newForm[planName] = {
//                         price: Number(plans[planName]?.price ?? 0),
//                         durationDays: Number(plans[planName]?.durationDays ?? 30),
//                         referralBonusPercent: Number(plans[planName]?.referralBonusPercent ?? 0),
//                       };
//                       setForm(newForm);
//                       if (window.toastify) window.toastify(`${planName} reset`, "info");
//                     }}
//                     className="px-3 py-1 rounded border"
//                   >
//                     Reset
//                   </button>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="mt-6 flex items-center gap-3">
//         <button
//           onClick={handleSave}
//           disabled={saving}
//           className={`px-6 py-2 rounded text-white ${saving ? "bg-gray-400" : "bg-primary"}`}
//         >
//           {saving ? "Saving…" : "Save changes"}
//         </button>

//         <button onClick={handleReset} className="px-4 py-2 rounded border">
//           Reset
//         </button>

//         <div className="ml-auto text-sm text-gray-500">
//           {Object.keys(form).length} plans loaded
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPlans() {
  const [plans, setPlans] = useState([]); // server array
  const [form, setForm] = useState([]); // editable array copy
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Try common token keys (adjust to your app)
  const getAuthHeader = () => {
    const token =
      localStorage.getItem("ecomplatadminjwt") ||
      localStorage.getItem("ecomplatadmintoken") ||
      localStorage.getItem("ecomplatsellerjwt") ||
      null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // normalize server array -> form array
  const normalizePlansArray = (arr) =>
    (arr || []).map((p) => ({
      name: String(p.name || "").trim(),
      price: Number(p.price ?? 0),
      durationDays: Number(p.durationDays ?? 30),
      referralBonusPercent: Number(p.referralBonusPercent ?? 0),
      signUpBonusPercent: Number(p.signUpBonusPercent ?? 0),
      isActive: Boolean(p.isActive ?? true),
      // copy server metadata if present
      _meta: { createdAt: p.createdAt, updatedAt: p.updatedAt },
    }));

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${window.api}/plans/admin`, {
          headers: getAuthHeader(),
        });

        // Support both shapes just in case:
        // 1) array response: res.data === [{...}, {...}]
        // 2) wrapped: res.data.plans === [{...}, {...}]
        // 3) legacy object keyed by name: res.data.plans (object) -> convert to array
        const data = res.data;
        let remoteArray = [];

        if (Array.isArray(data)) {
          remoteArray = data;
        } else if (Array.isArray(data?.plans)) {
          remoteArray = data.plans;
        } else if (data?.plans && typeof data.plans === "object") {
          // convert keyed object -> array using reduce
          remoteArray = Object.keys(data.plans).reduce((acc, k) => {
            const p = data.plans[k] || {};
            acc.push({ name: k, ...p });
            return acc;
          }, []);
        } else {
          // fallback: empty
          remoteArray = [];
        }

        setPlans(remoteArray);
        setForm(normalizePlansArray(remoteArray));
      } catch (err) {
        console.error("Fetch plans error:", err);
        setError(err.response?.data?.message || err.message || "Failed to load plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleChange = (planName, field, value) => {
    setForm((prev) =>
      prev.map((p) =>
        p.name === planName
          ? {
              ...p,
              [field]:
                field === "isActive"
                  ? Boolean(value)
                  : value === "" || value === null
                  ? ""
                  : // ensure numeric fields remain numbers
                    ["price", "durationDays", "referralBonusPercent", "signUpBonusPercent"].includes(field)
                  ? Number(value)
                  : value,
            }
          : p
      )
    );
  };

  // validation using array methods
  const validate = () => {
    if (!form || form.length === 0) return "No form data";
    const invalid = form.find((p) => {
      if (p.price == null || Number.isNaN(Number(p.price)) || Number(p.price) <= 0) return true;
      if (p.durationDays == null || Number.isNaN(Number(p.durationDays)) || Number(p.durationDays) < 1) return true;
      if (
        p.referralBonusPercent == null ||
        Number.isNaN(Number(p.referralBonusPercent)) ||
        p.referralBonusPercent < 0 ||
        p.referralBonusPercent > 100
      )
        return true;
      if (
        p.signUpBonusPercent == null ||
        Number.isNaN(Number(p.signUpBonusPercent)) ||
        p.signUpBonusPercent < 0 ||
        p.signUpBonusPercent > 100
      )
        return true;
      return false;
    });

    if (invalid) {
      // craft a helpful message by finding first broken plan and reason
      for (const p of form) {
        if (p.price == null || Number.isNaN(Number(p.price)) || Number(p.price) <= 0)
          return `${p.name}: price must be greater than 0`;
        if (p.durationDays == null || Number.isNaN(Number(p.durationDays)) || Number(p.durationDays) < 1)
          return `${p.name}: durationDays must be at least 1`;
        if (
          p.referralBonusPercent == null ||
          Number.isNaN(Number(p.referralBonusPercent)) ||
          p.referralBonusPercent < 0 ||
          p.referralBonusPercent > 100
        )
          return `${p.name}: referralBonusPercent must be between 0 and 100`;
        if (
          p.signUpBonusPercent == null ||
          Number.isNaN(Number(p.signUpBonusPercent)) ||
          p.signUpBonusPercent < 0 ||
          p.signUpBonusPercent > 100
        )
          return `${p.name}: signUpBonusPercent must be between 0 and 100`;
      }
    }

    return null;
  };

  const handleSave = async () => {
    const v = validate();
    if (v) {
      if (window.toastify) window.toastify(v, "error");
      else alert(v);
      return;
    }

    setSaving(true);
    try {
      // Convert form array -> { plans: { name: { ... } } } using reduce
      const payload = {
        plans: form.reduce((acc, p) => {
          acc[p.name] = {
            price: Number(p.price),
            durationDays: Number(p.durationDays),
            referralBonusPercent: Number(p.referralBonusPercent),
            signUpBonusPercent: Number(p.signUpBonusPercent),
            isActive: Boolean(p.isActive),
          };
          return acc;
        }, {}),
      };

      const res = await axios.put(`${window.api}/plans/admin`, payload, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });

      // Server returns an array of updated plans (per your updated routes)
      let updatedArray = [];
      if (Array.isArray(res.data)) updatedArray = res.data;
      else if (Array.isArray(res.data?.plans)) updatedArray = res.data.plans;
      else if (res.data?.plans && typeof res.data.plans === "object") {
        updatedArray = Object.keys(res.data.plans).reduce((acc, k) => {
          acc.push({ name: k, ...res.data.plans[k] });
          return acc;
        }, []);
      } else {
        // fallback to using our form copy if server returned unexpected shape
        updatedArray = form;
      }

      setPlans(updatedArray);
      setForm(normalizePlansArray(updatedArray));

      if (window.toastify) window.toastify("Plan settings updated", "success");
      else alert("Plan settings updated");
    } catch (err) {
      console.error("Save plans error:", err);
      const msg = err.response?.data?.message || err.message || "Failed to save plans";
      if (window.toastify) window.toastify(msg, "error");
      else alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(normalizePlansArray(plans));
    if (window.toastify) window.toastify("Form reset", "info");
  };

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-gray-500">Loading plans…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded shadow">
        <div className="text-red-600 font-medium mb-2">Failed to load plans</div>
        <div className="text-sm text-gray-600 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Plans configuration</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {form.map((p) => (
          <div key={p.name} className="p-6 bg-white rounded-xl shad">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <div className="text-sm text-gray-500">Editable</div>
            </div>

            <div className="space-y-4">
              <label className="text-sm text-gray-600">Price (PKR)</label>
              <input
                type="number"
                min="1"
                value={p.price === "" ? "" : p.price}
                onChange={(e) =>
                  handleChange(p.name, "price", e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full"
              />

              <label className="text-sm text-gray-600">Duration (days)</label>
              <input
                type="number"
                min="1"
                value={p.durationDays === "" ? "" : p.durationDays}
                onChange={(e) =>
                  handleChange(
                    p.name,
                    "durationDays",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="w-full"
              />

              <label className="text-sm text-gray-600">Referral Bonus (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={p.referralBonusPercent === "" ? "" : p.referralBonusPercent}
                onChange={(e) =>
                  handleChange(
                    p.name,
                    "referralBonusPercent",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="w-full"
              />

              <label className="text-sm text-gray-600">Sign-up Bonus (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={p.signUpBonusPercent === "" ? "" : p.signUpBonusPercent}
                onChange={(e) =>
                  handleChange(
                    p.name,
                    "signUpBonusPercent",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="w-full"
              />

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={Boolean(p.isActive)}
                  onChange={(e) => handleChange(p.name, "isActive", e.target.checked)}
                />
                Active
              </label>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Current server price:{" "}
                <strong>
                  {
                    // find server value for this plan by name
                    (plans.find((s) => s.name === p.name) || {}).price ?? "-"
                  }{" "}
                  PKR
                </strong>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    // reset single plan to server value using map
                    const serverPlan = plans.find((s) => s.name === p.name) || {};
                    setForm((prev) =>
                      prev.map((item) =>
                        item.name === p.name
                          ? {
                              ...item,
                              price: Number(serverPlan.price ?? 0),
                              durationDays: Number(serverPlan.durationDays ?? 30),
                              referralBonusPercent: Number(serverPlan.referralBonusPercent ?? 0),
                              signUpBonusPercent: Number(serverPlan.signUpBonusPercent ?? 0),
                              isActive: Boolean(serverPlan.isActive ?? true),
                            }
                          : item
                      )
                    );
                    if (window.toastify) window.toastify(`${p.name} reset`, "info");
                  }}
                  className="px-3 py-1 rounded border"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2 rounded text-white ${saving ? "bg-gray-400" : "bg-primary"}`}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>

        <button onClick={handleReset} className="px-4 py-2 rounded border">
          Reset
        </button>

        <div className="ml-auto text-sm text-gray-500">{form.length} plans loaded</div>
      </div>
    </div>
  );
}

