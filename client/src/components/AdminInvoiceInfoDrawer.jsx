import { Drawer, Descriptions, Tag, Typography, Image, Space, Button, Divider } from "antd";
import { FileTextOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

export default function AdminInvoiceInfoDrawer({
    invoice,
    open,
    onClose,
    onApprove,      // passed from InvoiceHistory
    isAdmin = false // true only in admin panel
}) {
    if (!invoice) return null;

    const statusColor =
        invoice.paymentStatus === "paid"
            ? "green"
            : invoice.paymentStatus === "pending"
            ? "orange"
            : "red";

    return (
        <Drawer
            open={open}
            onClose={onClose}
            width={500}
            title={
                <Space>
                    <FileTextOutlined />
                    <span>Invoice</span>
                    <Text type="secondary">#{invoice._id.slice(-8)}</Text>
                </Space>
            }
        >
            {/* Amount & Status */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Title level={2}>Rs {invoice.amount.toLocaleString()}</Title>
                <Tag color={statusColor}>{invoice.paymentStatus.toUpperCase()}</Tag>
            </div>

            <Descriptions size="small" column={1} bordered>
                <Descriptions.Item label="Plan">
                    <Tag color="blue">{invoice.plan}</Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Payment Method">
                    {invoice.type?.toUpperCase()}
                </Descriptions.Item>

                <Descriptions.Item label="Created At">
                    {new Date(invoice.createdAt).toLocaleString()}
                </Descriptions.Item>

                <Descriptions.Item label="Subscription Period">
                    {invoice.subscriptionStart
                        ? `${new Date(invoice.subscriptionStart).toLocaleDateString()} → ${new Date(invoice.subscriptionEnd).toLocaleDateString()}`
                        : "Pending Activation"}
                </Descriptions.Item>

                {/* Admin view */}
                {invoice.seller && (
                    <Descriptions.Item label="Seller">
                        {invoice.seller.brandName} ({invoice.seller.email})
                    </Descriptions.Item>
                )}
            </Descriptions>

            {/* Receipt */}
            {invoice.receipt && (
                <>
                    <Divider />
                    <Text strong>Payment Receipt</Text>
                    <Image
                        src={invoice.receipt}
                        width="100%"
                        style={{ marginTop: 12, borderRadius: 8 }}
                    />
                </>
            )}

            {/* Admin Action */}
            {isAdmin && invoice.paymentStatus === "pending" && (
                <>
                    <Divider />
                    <Button
                        type="primary"
                        size="large"
                        icon={<CheckCircleOutlined />}
                        block
                        onClick={() => onApprove(invoice._id)}
                    >
                        Approve & Activate Subscription
                    </Button>
                </>
            )}
        </Drawer>
    );
}
