import { Table, Tag, Button, Popconfirm, message } from "antd";
import axios from "axios";

export default function EarningsTable({ earnings = [], onActionComplete = () => { }}) {
  const markPaid = async (id) => {
    try {
      await axios.post(`${window.api}/referrals/earnings/${id}/mark-available`, {}, );
      message.success("Marked as available");
      onActionComplete();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to mark as available");
    }
  };

  const revertOrDelete = async (id, action) => {
    try {
      await axios.post(`${window.api}/referrals/earnings/${id}/revert`, { action });
      message.success(action === "delete" ? "Deleted" : "Reverted to pending");
      onActionComplete();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to update earning");
    }
  };

  const columns = [
    { title: "Type", dataIndex: "type", render: t => <span className="capitalize">{t}</span> },
    { title: "Amount", dataIndex: "amount", render: a => `Rs ${a}` },
    { title: "Status", dataIndex: "status", render: s => <Tag color={s === "paid" ? "green" : s === "pending" ? "gold" : "red"} className="capitalize">{s}</Tag> },
    { title: "Created", dataIndex: "createdAt", render: d => new Date(d).toLocaleString() },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          {record.status !== "paid" && (
            <Popconfirm title="Mark this earning as available?" onConfirm={() => markPaid(id)}>
              <Button type="primary" size="small">Mark Available</Button>
            </Popconfirm>)}
          <Popconfirm title="Revert to pending?" onConfirm={() => revertOrDelete(id, "pending")}>
            <Button size="small">Revert</Button>
          </Popconfirm>
          <Popconfirm title="Delete this earning permanently?" onConfirm={() => revertOrDelete(id, "delete")}>
            <Button danger size="small">Delete</Button>
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <Table columns={columns} dataSource={earnings} rowKey={(r) => r._id} pagination={{ pageSize: 8 }} />
  );
}