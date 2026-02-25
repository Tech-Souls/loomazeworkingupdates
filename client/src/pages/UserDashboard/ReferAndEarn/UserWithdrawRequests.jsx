import {useEffect, useState} from "react";
import { Table, Card, Typography, Tag } from "antd";
import axios from "axios";

const { Title } = Typography;

export default function UserWithdrawRequests() {
  const [data, setData] = useState([]);
  const columns = [
    { title: "Account Holder", dataIndex: "accountHolder" },
    { title: "Amount", dataIndex: "amount", render: a => `Rs ${a}` },
    { title: "Bank", dataIndex: "bankName" },
    { title: "Account / IBAN", dataIndex: "accountNumber" },
    {
      title: "Status",
      dataIndex: "status",
      render: s => (
        <Tag color={s === "approved" ? "green" : s === "paid" ? "blue" : s === "rejected" ? "red" : "gold"}>
          {s}
        </Tag>
      ),
    },
  ];

  useEffect(()=>{
    const fetchWithdraws = async()=>{
    const token = localStorage.getItem("jwt");
    const res = await axios.get(`${window.api}/withdraw/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setData(res.data);
    };
    fetchWithdraws();
  },[]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <Title level={2}>Refer & Earn</Title>

        <Card className="rounded-xl">
          <Title level={4}>Withdraw Requests</Title>
          <Table
            columns={columns}
            dataSource={data}
            rowKey={(record) => record._id}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    </div>
  );
}
