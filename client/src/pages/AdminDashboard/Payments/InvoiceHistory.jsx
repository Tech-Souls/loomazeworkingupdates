import { useEffect, useState, useCallback } from "react";
import { Input, Select, Table, Typography, Tag, Card, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import InvoiceInfoDrawer from "@/components/AdminInvoiceInfoDrawer";
import { useUserAuthContext } from "@/contexts/UserAuthContext";
import axios from "axios";

const { Title, Text } = Typography;
const { Search } = Input;

export default function InvoiceHistory() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const { user } = useUserAuthContext();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);
    const [sortField, setSortField] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const token = localStorage.getItem("ecomplatsellerjwt");
    const isAdmin = user?.role === "admin";

    const fetchInvoices = useCallback((params = {}) => {
        setLoading(true);
        axios.get(`${window.api}/payments/admin/invoices`, { headers: { Authorization: `Bearer ${token}`, }, params: { page: params.pageNum || page, search, limit: params.limitNum || limit, sortField: params.sortF || sortField, sortOrder: params.sortO || sortOrder, status: statusFilter, } })
            .then((res) => {
                const { status, data } = res;
                if (status === 200) {
                    setInvoices(data.data);
                    setTotal(data.total || 0);
                }
            }).catch((err) => {
                console.log('err :>> ', err);
                window.toastify("Failed to load invoices", "error");
            }).finally(() => {
                setLoading(false);
            })
    }, [token, page, limit, sortField, sortOrder, search, statusFilter]);

    useEffect(() => { setPage(1); fetchInvoices({ pageNum: 1 }); }, [search, sortField, sortOrder, statusFilter]);

    const handleTableChange = (pagination, _, sorter) => {
        const newPage = pagination.current;
        const newLimit = pagination.pageSize;
        const newSortField = sorter.field || "createdAt";
        const newSortOrder = sorter.order === "ascend" ? "asc" : "desc";

        setPage(newPage);
        setLimit(newLimit);
        setSortField(newSortField);
        setSortOrder(newSortOrder);

        fetchInvoices({ pageNum: newPage, limitNum: newLimit, sortF: newSortField, sortO: newSortOrder });
    };

    const changeStatus = async (id, status) => {
        await axios.put(`${window.api}/payments/change-status/${id}`, { status, }, { headers: { Authorization: `Bearer ${token}` }, })
            .then((res) => {
                const { status } = res;
                if (status === 200) {
                    window.toastify("Invoice updated", "success");
                    fetchInvoices();
                    setSelectedInvoice(null);
                }
            })
    };

    const columns = [
        { title: "Brand Name", dataIndex: "brandName", render: (_, record) => record.seller?.brandName || "N/A" },
        { title: "Email", dataIndex: "Email", render: (_, record) => (<Text ellipsis={{ tooltip: record?.seller?.email }} style={{ maxWidth: 160, display: "inline-block" }}>{record?.seller?.email || "N/A"}</Text>) },
        { title: "Date", dataIndex: "createdAt", sorter: true, render: (d) => new Date(d).toLocaleDateString(), },
        { title: "Plan", dataIndex: "plan", },
        { title: "Amount", dataIndex: "amount", sorter: true, render: (a) => `Rs ${a.toLocaleString()}` },
        { title: "Status", dataIndex: "paymentStatus", render: (status) => { const color = status === "paid" ? "green" : status === "pending" ? "orange" : status === "refund" ? "blue" : "red"; return <Tag color={color}>{status.toUpperCase()}</Tag>; }, },
        {
            title: "Seller Plan / Actions",
            render: (_, record) => {

                if (record.paymentStatus === "pending") {
                    return (
                        <div className="flex gap-2">
                            <Button size="small" type="primary" onClick={(e) => { e.stopPropagation(); changeStatus(record._id, "paid") }}>Mark as Paid</Button>
                            <Button size="small" danger onClick={(e) => { e.stopPropagation(); changeStatus(record._id, "rejected") }}>Reject</Button>
                        </div>
                    );
                }

                if (record.paymentStatus === "paid") {
                    return (
                        <div className="flex gap-2 items-center">
                            <Tag color="green">ACTIVE</Tag>
                            <Button size="small" onClick={(e) => { e.stopPropagation(); changeStatus(record._id, "refund") }}>Refund</Button>
                            <Button size="small" onClick={(e) => { e.stopPropagation(); changeStatus(record._id, "pending") }}>Revert</Button>
                        </div >
                    );
                }

                if (record.paymentStatus === "refund") {
                    return (
                        <div className="flex gap-2 items-center">
                            <Tag color="red">REFUNDED</Tag>
                        </div>
                    );
                }
                if (record.paymentStatus === "rejected") {
                    return (
                        <div className="flex gap-2 items-center">
                            <Tag color="red">REJECTED</Tag>
                            <Button size="small" onClick={(e) => { e.stopPropagation(); changeStatus(record._id, "pending") }}>Revert</Button>
                        </div>);
                }
                return null;
            }
        }
    ];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex flex-wrap gap-8 mb-4 justify-center items-center">
                <Search placeholder="Search by brand name or seller email" allowClear enterButton onSearch={(value) => setSearch(value.trim())} style={{ width: 300 }} />
                <Select placeholder="Filter by Status" value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1); }} style={{ width: 150 }} options={[{ label: "All Status", value: "" }, { label: "Paid", value: "paid" }, { label: "Pending", value: "pending" }, { label: "Rejected", value: "rejected" }, { label: "Refund", value: "refund" }]} />
                <Select value={sortField} onChange={v => setSortField(v)} style={{ width: 160 }} options={[{ label: "Newest", value: "createdAt" }, { label: "Amount", value: "amount" }]} />
                <Select value={sortOrder} onChange={v => setSortOrder(v)} style={{ width: 140 }} options={[{ label: "Descending", value: "desc" }, { label: "Ascending", value: "asc" }]} />
                <Button icon={<ReloadOutlined />} onClick={() => fetchInvoices()} loading={loading} >Refresh</Button>
            </div>

            <Title level={3}>Invoice History</Title>
            <Card className="shadow-lg rounded-xl">
                <Table rowKey="_id" loading={loading} dataSource={invoices} columns={columns} pagination={{ current: page, pageSize: limit, total, showSizeChanger: true, }} onChange={handleTableChange} onRow={(record) => ({ onClick: () => setSelectedInvoice(record), })} className="cursor-pointer" bordered />
            </Card>
            <InvoiceInfoDrawer open={!!selectedInvoice} invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} onApprove={isAdmin ? () => changeStatus(selectedInvoice._id, "paid") : null} />
        </div>
    );
}