import { useEffect, useState } from "react";
import { Table, Card, Typography, Tag, Modal, Button, Select } from "antd";
import { EditOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

export default function UserWithdraws() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWithdraw, setSelectedWithdraw] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Open modal with selected row
  const openModal = (record) => {
    setSelectedWithdraw(record);
    setNewStatus(record.status); // pre-select current status
    setIsModalOpen(true);
  };

  // Handle status update (currently just logs)
  // const handleStatusUpdate = () => {
  //   console.log("Updating status for:", selectedWithdraw._id, "to", newStatus);
  //   setIsModalOpen(false);
  //   // ✅ Next step: call backend API here
  // };
  const handleStatusUpdate = async () => {
  try {
    const token = localStorage.getItem("jwt");

    const res = await axios.patch(
      `${window.api}/admin/withdraw/user/${selectedWithdraw._id}`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Update frontend table immediately
    setData((prev) =>
      prev.map((item) =>
        item._id === selectedWithdraw._id ? { ...item, status: newStatus } : item
      )
    );

    setIsModalOpen(false);
    console.log("Status updated:", res.data);
  } catch (err) {
    console.error("Error updating status:", err);
  }
};


  const columns = [
    { title: "Account Holder", dataIndex: "accountHolder" },
    { title: "Amount", dataIndex: "amount", render: (a) => `Rs ${a}` },
    { title: "Bank", dataIndex: "bankName" },
    { title: "Account / IBAN", dataIndex: "accountNumber" },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => (
        <Tag
          color={
            s === "approved"
              ? "green"
              : s === "paid"
              ? "blue"
              : s === "rejected"
              ? "red"
              : "gold"
          }
        >
          {s}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <EditOutlined
          style={{ fontSize: "18px", color: "#1890ff", cursor: "pointer" }}
          onClick={() => openModal(record)}
        />
      ),
    },
  ];

  // Fetch data from backend
  useEffect(() => {
    const fetchWithdraws = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get(`${window.api}/admin/withdraws/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching withdraws:", err);
      }
    };
    fetchWithdraws();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <Title level={2}>User Withdraws</Title>

        <Card className="rounded-xl">
          <Title level={4}>Withdraw Requests</Title>
          <Table
            columns={columns}
            dataSource={data}
            rowKey={(record) => record._id}
            pagination={{ pageSize: 10 }}
          />

          {/* Status Update Modal */}
          <Modal
            title="Update Withdraw Status"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={[
              <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>,
              <Button key="save" type="primary" onClick={handleStatusUpdate}>
                Save
              </Button>,
            ]}
          >
            <Select
              value={newStatus}
              onChange={(value) => setNewStatus(value)}
              style={{ width: "100%" }}
            >
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="approved">Approved</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
              <Select.Option value="paid">Paid</Select.Option>
            </Select>
          </Modal>
        </Card>
      </div>
    </div>
  );
}
