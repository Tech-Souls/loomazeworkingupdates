import { Routes, Route } from "react-router-dom";
import Overview from "./Overview";
import WithdrawRequests from "./WithdrawRequests";

const ReferAndEarn = () => {
  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path="withdraws" element={<WithdrawRequests />} />
    </Routes>
  );
};

export default ReferAndEarn;
