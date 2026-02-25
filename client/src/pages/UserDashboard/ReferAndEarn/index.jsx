import { Routes, Route } from "react-router-dom";
import Overview from "./Overview";
import UserWithdrawRequests from "./UserWithdrawRequests";

const ReferAndEarn = () => {
  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path="withdraws" element={<UserWithdrawRequests />} />
    </Routes>
  );
};

export default ReferAndEarn;
