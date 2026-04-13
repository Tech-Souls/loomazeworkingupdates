// import React, { useCallback, useEffect, useState } from "react";
// import axios from "axios";
// import { Card, Table, Tag, Button, Typography, message, Divider, Modal, Form, Input } from "antd";
// import { CopyOutlined } from "@ant-design/icons";
// import { Coins as CoinsIcon } from "lucide-react";
// import StatCard from "@/components/StatCard";
// const { Title, Text, Paragraph } = Typography;
// import { useSellerAuthContext } from "@/contexts/SellerAuthContext";
// import { useNavigate } from "react-router-dom";

// export default function ReferAndEarnUser() {
//   const { user } = useSellerAuthContext();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [withdrawOpen, setWithdrawOpen] = useState(false);
//   const navigate = useNavigate();

//   const token = localStorage.getItem("ecomplatsellerjwt");

//   const referralLink = user ? `${window.location.origin}/auth/seller/signup?ref=${user.referralCode}` : "";
//   const fetchStats = useCallback(async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const res = await axios.get(`${window.api}/referrals/seller`, { headers: { Authorization: `Bearer ${token}` } });
//       setData(res.data);
//     } catch {
//       message.error("Failed to load referral statistics");
//     } finally {
//       setLoading(false);
//     }
//   }, [token]);

//   useEffect(() => { fetchStats(); }, [fetchStats]);

//   const copyLink = () => {
//     navigator.clipboard.writeText(referralLink);
//     message.success("Referral link copied");
//   };

//   const columns = [
//     { title: "Brand", dataIndex: "brand", render: v => <Text strong className="text-blue-600">{v}</Text> },
//     { title: "Joined", dataIndex: "joinedAt", render: d => d ? new Date(d).toLocaleDateString() : "—" },
//     { title: "Status", dataIndex: "status", render: s => (<Tag color={s === "approved" ? "green" : "gold"} className="capitalize">{s}</Tag>) }
//   ];

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-6xl mx-auto space-y-6">
//         <div>
//           <Title level={2}>Refer & Earn</Title>
//           <Text type="secondary">Earn commissions for every seller you refer.</Text>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-6">
//           <Card className="lg:col-span-2 rounded-xl">
//             <Title level={4}>Your Referral Link</Title>
//             <Paragraph type="secondary">Share this link to invite sellers.</Paragraph>
//             <div className="flex items-center justify-between p-3 bg-gray-50 border rounded">
//               <Text code className="truncate!">{referralLink}</Text>
//               <Button icon={<CopyOutlined />} onClick={copyLink} type="primary">Copy</Button>
//             </div>
//             <Divider />
//             <div className="grid grid-cols-3 gap-4">
//               <StatCard title="Total Earned" value={data?.totalEarned ?? 0} prefix="Rs" icon={<CoinsIcon />} loading={loading} />
//               <StatCard title="Referrals" value={data?.totalReferrals ?? 0} icon={<></>} loading={loading} />
//               <StatCard title="Active Sellers" value={data?.activeSellers ?? 0} icon={<></>} loading={loading} />
//             </div>
//           </Card>

//           <div className="grid grid-cols-2 gap-4">
//   <StatCard
//     title="Pending"
//     value={data?.pending ?? 0}
//     prefix="Rs"
//     icon={<></>}
//     loading={loading}
//   />

//   <StatCard
//     title="Available"
//     value={(data?.totalEarned ?? 0) - (data?.pending ?? 0)}
//     prefix="Rs"
//     loading={loading}
//   >
// <button
//   type="button"
//   onClick={() => setWithdrawOpen(true)}
// //   disabled={
// //     ((data?.totalEarned ?? 0) - (data?.pending ?? 0)) <= 0
// //   }
//   className="
//     w-full
//     flex items-center justify-center
//     px-6 py-2.5
//     text-xs font-bold text-white
//     bg-[var(--primary)]
//     rounded-[8px]
//     transition-all duration-200 ease-linear
//     hover:bg-[var(--primary)]/70
//     disabled:opacity-50
//     disabled:cursor-not-allowed
//   "
// >
//   Withdraw
// </button>

//   </StatCard>
// </div>

//         </div>

//         <Card title="Referred Sellers" className="rounded-xl">
//           <Table
//             columns={columns}
//             dataSource={data?.sellers || []}
//             loading={loading}
//             pagination={{ pageSize: 5 }}
//             rowKey={(r) => `${r.brand}-${r.joinedAt || ""}`}
//           />
//         </Card>

//         <Card title="Earnings" className="rounded-xl">
//           <Table
//             columns={[
//               { title: "Type", dataIndex: "type", render: t => <Text className="capitalize">{t}</Text> },
//               { title: "Amount", dataIndex: "amount", render: a => `Rs ${a}` },
//               { title: "Status", dataIndex: "status", render: s => <Tag color={s === "paid" ? "green" : s === "pending" ? "gold" : "red"} className="capitalize">{s}</Tag> },
//               { title: "Created", dataIndex: "createdAt", render: d => new Date(d).toLocaleString() }
//             ]}
//             dataSource={data?.earnings || []}
//             rowKey={(r) => r._id}
//             pagination={{ pageSize: 10 }}
//           />
//         </Card>
//      <Modal
//   title="Withdraw Amount"
//   open={withdrawOpen}
//   onCancel={() => setWithdrawOpen(false)}
//   footer={null}
// >
//   <Form
//     layout="vertical"
//     onFinish={async(values) => {
//       console.log(values);
//       try{
//       const token = localStorage.getItem("jwt");
//       await axios.post(`${window.api}/withdraw/user/create`, {...values },{ headers: { Authorization: `Bearer ${token}` } })

//       message.success("Withdraw request submitted");
//       setWithdrawOpen(false);
//       navigate("/user/refer-earn/withdraws");

//       }catch(err){
//         console.error(err);
//         message.error("Failed to submit withdraw request");
//       }

//     }}
//   >
//     <Form.Item
//       label="Withdraw Amount"
//       name="amount"
//     //   rules={[
//     //     { required: true, message: "Please enter amount" },
//     //     {
//     //       validator: (_, value) => {
//     //         const available =
//     //           (data?.totalEarned ?? 0) - (data?.pending ?? 0);

//     //         if (!value || value < 1000) {
//     //           return Promise.reject("Minimum withdraw amount is Rs 1000");
//     //         }

//     //         if (value > available) {
//     //           return Promise.reject("Amount exceeds available balance");
//     //         }

//     //         return Promise.resolve();
//     //       },
//     //     },
//     //   ]}
//     >
//       <Input type="number" placeholder="Minimum Rs 1000" />
//     </Form.Item>

//     <Form.Item
//       label="Account Holder Name"
//       name="accountHolder"
//       rules={[{ required: true, message: "Please enter account holder name" }]}
//     >
//       <Input placeholder="e.g. Muhammad Ali" />
//     </Form.Item>

//     <Form.Item
//       label="Bank Name"
//       name="bankName"
//       rules={[{ required: true, message: "Please enter bank name" }]}
//     >
//       <Input placeholder="e.g. HBL / Meezan Bank" />
//     </Form.Item>

//     <Form.Item
//       label="Account Number / IBAN"
//       name="accountNumber"
//       rules={[
//         { required: true, message: "Please enter account number or IBAN" },
//         { min: 8, message: "Account number / IBAN is too short" },
//       ]}
//     >
//       <Input placeholder="Account number or IBAN" />
//     </Form.Item>

//     <button
//   type="submit"
//   className="
//     w-full
//     flex items-center justify-center gap-2
//     px-6 py-2.5
//     text-xs font-bold text-white
//     bg-[var(--primary)]
//     rounded-[8px]
//     transition-all duration-200 ease-linear
//     hover:bg-[var(--primary)]/70
//     disabled:opacity-50
//   "
// >
//   Submit
// </button>

//   </Form>
// </Modal>

//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Card,
  Table,
  Typography,
  Button,
  Result,
  Tag,
  Row,
  Col,
  Divider,
  message,
  Modal,
  Form,
  Input,
} from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { Coins as CoinsIcon } from "lucide-react";
import StatCard from "@/components/StatCard";
import { useNavigate } from "react-router-dom";
import { useUserAuthContext } from "../../../contexts/UserAuthContext";
const { Title, Text, Paragraph } = Typography;

export default function ReferAndEarnUser() {
  const [stats, setStats] = useState(null);
  const { user } = useUserAuthContext();
  const [loading, setLoading] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("jwt");

  const fetchStats = useCallback(() => {
    setLoading(true);
    axios
      .get(`${window.api}/referrals/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status === 200) setStats(res.data);
        console.log("Referral Stats:", res.data);
      })
      .catch(() => {
        window.toastify?.("Failed to load referral data", "error");
      })
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // const referralLink = `${window.location.origin}/auth/seller/signup?ref=${stats?.referralCode || ""}`;
  const referralLink = `${window.location.origin}/auth/seller/signup?ref=${user?.referralCode || ""}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    window.toastify?.("Referral link copied", "success");
  };

  const columns = [
    {
      title: "Brand",
      dataIndex: "brand",
      render: (v) => (
        <Text strong className="text-blue-600">
          {v}
        </Text>
      ),
    },
    {
      title: "Joined",
      dataIndex: "joinedAt",
      render: (d) => (d ? new Date(d).toLocaleDateString() : "—"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => (
        <Tag color={s === "approved" ? "green" : "gold"} className="capitalize">
          {s}
        </Tag>
      ),
    },
  ];
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <Title level={2}>Refer & Earn</Title>
          <Text type="secondary">
            Invite sellers and earn commission from their sales.
          </Text>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 rounded-xl">
            <Title level={4}>Your Referral Link</Title>
            <Paragraph type="secondary">
              Share this link to onboard new sellers.
            </Paragraph>
            <div className="flex items-center justify-between p-3 bg-gray-50 border rounded">
              <Text code className="truncate">
                {referralLink}
              </Text>
              <Button type="primary" icon={<CopyOutlined />} onClick={copyLink}>
                Copy
              </Button>
            </div>
            <Divider />
            <Row gutter={16}>
              <Col span={8}>
                <StatCard
                  title="Total Earned"
                  value={stats?.totalEarned ?? 0}
                  prefix="Rs"
                  icon={<CoinsIcon />}
                  loading={loading}
                />
              </Col>
              <Col span={8}>
                <StatCard
                  title="Total Referrals"
                  value={stats?.totalReferrals ?? 0}
                  icon={<></>}
                  loading={loading}
                />
              </Col>
              <Col span={8}>
                <StatCard
                  title="Active Sellers"
                  value={stats?.activeSellers ?? 0}
                  icon={<></>}
                  loading={loading}
                />
              </Col>
            </Row>
          </Card>

          {/* <div className="grid grid-cols-2 gap-4">
            <StatCard title="Pending" value={stats?.pending ?? 0} prefix="Rs" icon={<></>} loading={loading} />
            <StatCard title="Available" value={(stats?.totalEarned ?? 0) - (stats?.pending ?? 0)} prefix="Rs" icon={<></>} loading={loading} />
            
          </div> */}

          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Pending"
              value={stats?.pending ?? 0}
              prefix="Rs"
              icon={<></>}
              loading={loading}
            />

            <StatCard
              title="Available"
              value={(stats?.totalEarned ?? 0) - (stats?.pending ?? 0)}
              prefix="Rs"
              loading={loading}
            >
              <button
                type="button"
                onClick={() => setWithdrawOpen(true)}
                disabled={
                  (stats?.totalEarned ?? 0) - (stats?.pending ?? 0) <= 0
                }
                className="
    w-full
    flex items-center justify-center
    px-6 py-2.5
    text-xs font-bold text-white
    bg-[var(--primary)]
    rounded-[8px]
    transition-all duration-200 ease-linear
    hover:bg-[var(--primary)]/70
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
              >
                Withdraw
              </button>
            </StatCard>
          </div>
        </div>

        <Card title="Referred Sellers" className="rounded-xl">
          <Table
            columns={columns}
            dataSource={stats?.sellers || []}
            rowKey={(r) => `${r.brand}-${r.joinedAt || ""}`}
            pagination={{ pageSize: 5 }}
            loading={loading}
          />
        </Card>

        <Card title="Earnings" className="rounded-xl">
          <Table
            columns={[
              {
                title: "Type",
                dataIndex: "type",
                render: (t) => <Text className="capitalize">{t}</Text>,
              },
              {
                title: "Amount",
                dataIndex: "amount",
                render: (a) => `Rs ${a}`,
              },
              {
                title: "Status",
                dataIndex: "status",
                render: (s) => (
                  <Tag
                    color={
                      s === "paid" ? "green" : s === "pending" ? "gold" : "red"
                    }
                    className="capitalize"
                  >
                    {s}
                  </Tag>
                ),
              },
              {
                title: "Created",
                dataIndex: "createdAt",
                render: (d) => new Date(d).toLocaleString(),
              },
            ]}
            dataSource={stats?.earnings || []}
            rowKey={(r) => r._id}
            pagination={{ pageSize: 10 }}
          />
        </Card>
        <Modal
          title="Withdraw Amount"
          open={withdrawOpen}
          onCancel={() => setWithdrawOpen(false)}
          footer={null}
        >
          <Form
            layout="vertical"
            onFinish={async (values) => {
              console.log(values);
              if (
                values.amount >
                (data?.totalEarned ?? 0) - (data?.pending ?? 0)
              ) {
                message.error("Amount exceeds available balance");
                return;
              }
              if (values.amount < 1000) {
                message.error("Minimum withdraw amount is Rs 1000");
                return;
              }

              // try {
              //   const token = localStorage.getItem("jwt");
              //   await axios.post(
              //     `${window.api}/withdraw/user/create`,
              //     { ...values },
              //     { headers: { Authorization: `Bearer ${token}` } },
              //   );

              //   message.success("Withdraw request submitted");
              //   setWithdrawOpen(false);
              //   navigate("/user/refer-earn/withdraws");
              // } catch (err) {
              //   console.error(err);
              //   message.error("Failed to submit withdraw request");
              // }
            }}
          >
            <Form.Item
              label="Withdraw Amount"
              name="amount"
              //   rules={[
              //     { required: true, message: "Please enter amount" },
              //     {
              //       validator: (_, value) => {
              //         const available =
              //           (data?.totalEarned ?? 0) - (data?.pending ?? 0);

              //         if (!value || value < 1000) {
              //           return Promise.reject("Minimum withdraw amount is Rs 1000");
              //         }

              //         if (value > available) {
              //           return Promise.reject("Amount exceeds available balance");
              //         }

              //         return Promise.resolve();
              //       },
              //     },
              //   ]}
            >
              <Input type="number" placeholder="Minimum Rs 1000" />
            </Form.Item>

            <Form.Item
              label="Account Holder Name"
              name="accountHolder"
              rules={[
                { required: true, message: "Please enter account holder name" },
              ]}
            >
              <Input placeholder="e.g. Muhammad Ali" />
            </Form.Item>

            <Form.Item
              label="Bank Name"
              name="bankName"
              rules={[{ required: true, message: "Please enter bank name" }]}
            >
              <Input placeholder="e.g. HBL / Meezan Bank" />
            </Form.Item>

            <Form.Item
              label="Account Number / IBAN"
              name="accountNumber"
              rules={[
                {
                  required: true,
                  message: "Please enter account number or IBAN",
                },
                { min: 8, message: "Account number / IBAN is too short" },
              ]}
            >
              <Input placeholder="Account number or IBAN" />
            </Form.Item>

            <button
              type="submit"
              className="
    w-full
    flex items-center justify-center gap-2
    px-6 py-2.5
    text-xs font-bold text-white
    bg-[var(--primary)]
    rounded-[8px]
    transition-all duration-200 ease-linear
    hover:bg-[var(--primary)]/70
    disabled:opacity-50
  "
            >
              Submit
            </button>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
