import { Row, Col, Card, Typography } from "antd";
import { GlobalOutlined, AppstoreOutlined, BarChartOutlined, FileDoneOutlined, SafetyCertificateOutlined, CloudUploadOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const Adminfeatures = () => {

    const features = [
        { title: "Built for Global Ease", icon: <GlobalOutlined />, text: "All features are designed specifically for Brands to market themselves, including payment gateways, COD, and user-friendly workflows." },
        { title: "Complete Store Management", icon: <AppstoreOutlined />, text: "Manage products, categories, inventory, store layout, and pricing from one centralized admin dashboard." },
        { title: "Sales & Business Analytics", icon: <BarChartOutlined />, text: "Track revenue, visitors, orders, and best-selling products in real time." },
        { title: "Tax & Invoice System", icon: <FileDoneOutlined />, text: "Control GST, invoices, commissions, and vendor payouts with a built-in billing system." },
        { title: "Secure Authentication", icon: <SafetyCertificateOutlined />, text: "Enterprise-grade login, role-based access, and account protection for your business." },
        { title: "Cloud Media Storage", icon: <CloudUploadOutlined />, text: "Upload and manage product images and digital assets securely in the cloud." }
    ];

    return (
        <section className="relative py-15 md:py-28 bg-white overflow-hidden" id="admin-features">
            <div className="max-w-7xl mx-auto px-5 md:px-8">

                <div className="text-center max-w-4xl mx-auto mb-16 md:mb-20 relative">
                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-primary/10 blur-[120px] rounded-full" />
                    <Title level={2} className="text-3xl! md:text-4xl! font-bold! tracking-tight!">
                        eCommerce Marketplace Platform <span className="text-primary">loomaze </span>
                    </Title>

                    <Paragraph className="text-base! md:text-lg! text-gray-600! mt-5! leading-relaxed!">
                        Launch your professional online store with <strong>custom domain, themes, full admin control and enterprise-grade security</strong> — starting from <strong>just Rs. 2,000.</strong>
                    </Paragraph>

                    <Paragraph className="text-sm md:text-base text-gray-500 mt-3 max-w-3xl mx-auto">
                        Built for brands that want full ownership and PKR-based pricing without relying on expensive foreign platforms.
                    </Paragraph>
                </div>

                <Row gutter={[20, 20]} align="stretch">
                    {features.map((item, index) => (
                        <Col xs={24} sm={12} lg={8} key={index} className="flex!">
                            <Card data-aos="zoom-in" data-aos-delay={index * 80} hoverable className="w-full! border! border-gray-200! rounded-2xl! shadow-sm! transition-all! hover:-translate-y-1! hover:shadow-md!">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-start gap-4">
                                        <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-primary/10 text-primary text-xl shrink-0">
                                            {item.icon}
                                        </div>
                                        <Title level={5} className="mb-0! text-base! md:text-lg! font-semibold! leading-snug!">
                                            {item.title}
                                        </Title>
                                    </div>
                                    <div className="mt-3 flex-1">
                                        <Paragraph className="text-gray-600! text-sm! md:text-base! leading-relaxed!">
                                            {item.text}
                                        </Paragraph>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <div className="mt-20 max-w-5xl mx-auto relative overflow-hidden" data-aos="fade-right">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent blur-3xl rounded-3xl" />
                    <div className="relative bg-white border-2 border-gray-200 rounded-3xl p-7 md:p-14 text-center">
                        <Title level={3} className="text-2xl! md:text-4xl! font-semibold!">
                            Built for Businesses — Designed for Local Growth
                        </Title>
                        <Paragraph className="text-base! md:text-lg! text-gray-600! mt-5! leading-relaxed!">
                            Most international platforms charge in dollars and limit customization. Our platform gives you
                            <strong> domain, hosting, themes, security, admin dashboard and full ownership </strong>
                            — all in one affordable PKR-based solution.
                        </Paragraph>
                        <Paragraph className="text-lg md:text-xl font-medium text-gray-800 mt-6">
                            Start your professional eCommerce website from
                            <span className="text-primary font-semibold"> Rs. 2,000 only</span>.
                        </Paragraph>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Adminfeatures;