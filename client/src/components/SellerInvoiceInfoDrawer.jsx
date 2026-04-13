import { Drawer, Descriptions, Tag, Typography, Image, Space } from "antd";
import { FileTextOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

export default function SellerInvoiceInfoDrawer({ invoice, open, onClose }) {
    if (!invoice) return null;
    const color = invoice.paymentStatus === "paid" ? "success" : invoice.paymentStatus === "pending" ? "warning" : "error";

    return (
        <Drawer open={open} onClose={onClose} width={480} title={<Space><FileTextOutlined /><span>Invoice</span><Text type="secondary">#{invoice._id.slice(-8)}</Text></Space>}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Title level={2}>Rs {invoice.amount.toLocaleString()}</Title>
                <Tag color={color}>{invoice.paymentStatus.toUpperCase()}</Tag>
            </div>
            <Descriptions size="small" column={1}>
                <Descriptions.Item label="Plan"><Tag color="blue">{invoice.plan}</Tag></Descriptions.Item>
                <Descriptions.Item label="Method">{invoice.type}</Descriptions.Item>
                <Descriptions.Item label="Created">{new Date(invoice.createdAt).toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="Period">
                    {invoice.subscriptionStart ? `${new Date(invoice.subscriptionStart).toLocaleDateString()} → ${new Date(invoice.subscriptionEnd).toLocaleDateString()}` : "Pending"}
                </Descriptions.Item>
            </Descriptions>
            {invoice.receipt && (
                <Image src={invoice.receipt} width="100%" style={{ marginTop: 16, borderRadius: 8 }} />
            )}
        </Drawer>
    );
}
