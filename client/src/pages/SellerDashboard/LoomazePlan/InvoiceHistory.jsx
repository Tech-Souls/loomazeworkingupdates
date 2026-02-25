import { useCallback, useEffect, useState } from "react";
import { Table, Typography, Tag, Spin, Card } from "antd";
import axios from "axios";
import InvoiceInfoDrawer from "@/components/SellerInvoiceInfoDrawer";

const { Title } = Typography;
export default function InvoiceHistory() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);
    const [sortField, setSortField] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");

    const token = localStorage.getItem("ecomplatsellerjwt");

    const fetchInvoices = useCallback(async ({ pageNum = page, limitNum = limit, sortF = sortField, sortO = sortOrder } = {}) => {
        setLoading(true);
        try {
            const { data, status } = await axios.get(`${window.api}/payments/seller/invoices`, { headers: { Authorization: `Bearer ${token}` }, params: { page: pageNum, limit: limitNum, sort: `${sortF}:${sortO}` } });
            if (status === 200) {
                setInvoices(data.invoices || []);
                setTotal(data.total || 0);
                setPage(data.page || 1);
                setLimit(data.limit || limitNum);
            }
        } catch (err) {
            console.error("Fetch invoices error:", err);
            window.toastify("Failed to load invoices", "error");
        } finally {
            setLoading(false);
        }
    }, [token, page, limit, sortField, sortOrder]);

    useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

    const columns = [
        { title: "Date", dataIndex: "createdAt", sorter: true, render: date => new Date(date).toLocaleDateString() },
        { title: "Plan", dataIndex: "plan" },
        { title: "Amount", dataIndex: "amount", sorter: true, render: amt => `Rs ${amt.toLocaleString()}` },
        { title: "Status", dataIndex: "paymentStatus", render: status => { const color = status === "paid" ? "green" : status === "pending" ? "orange" : "red"; return <Tag color={color}>{status.toUpperCase()}</Tag>; } },
        { title: "Type", dataIndex: "type", render: t => t.toUpperCase() }
    ];

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

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Title level={3} className="mb-4">Invoice History</Title>

            <Card style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} styles={{ padding: "24px" }}>
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table dataSource={invoices} columns={columns} rowKey="_id" loading={loading} pagination={{ current: page, pageSize: limit, total, showSizeChanger: true, pageSizeOptions: [5, 10, 20] }} onChange={handleTableChange} onRow={record => ({ onClick: () => setSelectedInvoice(record) })} className="cursor-pointer" bordered />
                )}
            </Card>
            <InvoiceInfoDrawer
                open={!!selectedInvoice}
                invoice={selectedInvoice}
                onClose={() => setSelectedInvoice(null)}
            />
        </div>
    );
}
