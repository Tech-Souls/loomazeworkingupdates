import { Table, Tag } from "antd";

export default function WithdrawTable({ data, loading, onAction }) {
  const columns = [
    { title: "Seller", dataIndex: "name" },
    { title: "Amount", dataIndex: "amount", render: (a) => `Rs ${a}` },
    { title: "Bank", dataIndex: "bankName" },
    { title: "Account / IBAN", dataIndex: "accountNumber" },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => (
        <Tag color={s === "approved" ? "green" : s === "rejected" ? "red" : "gold"}>
          {s}
        </Tag>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="flex gap-2">
          {record.status === "pending" && (
            <>
              <button onClick={() => onAction(record._id, "approved")} className="btn-green">Approve</button>
              <button onClick={() => onAction(record._id, "rejected")} className="btn-red">Reject</button>
            </>
          )}
        </div>
      ),
    },
  ];

  return <Table dataSource={data} columns={columns} loading={loading} rowKey={(r) => r._id} />;
}
