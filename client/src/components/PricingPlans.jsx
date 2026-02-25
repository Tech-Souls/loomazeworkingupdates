import { useState } from "react";
import { Card, Typography, Button, Segmented, Tag } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { pricingPlans } from "@/data/pricingPlans";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;
const PricingPlans = () => {
    const [billing, setBilling] = useState("monthly");
    const navigate = useNavigate();
    return (
        <section className="pb-15 pt-10 bg-gradient-to-b from-white to-slate-50">
            <div className="px-6 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <Title level={2} className="text-3xl! font-semibold! lg:font-bold! mb-4!">Simple, Transparent Pricing</Title>
                    <Paragraph className="text-gray-500! text-lg!">Save more when you pay yearly — just like loomaze</Paragraph>
                </div>
                <div className="flex justify-center mb-16">
                    <Segmented options={[{ label: "Monthly", value: "monthly" }, { label: "Yearly (Save 20%)", value: "yearly" }]} value={billing} onChange={setBilling} size="large" className="pricing-segment p-1!" />
                </div>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
                    {pricingPlans.map((plan) => {
                        const price = billing === "monthly" ? plan.monthly : plan.yearly;
                        return (
                            <Card key={plan.id} className={`relative! pricing-card rounded-2xl! border-2! transition-all! duration-300! hover:shadow-2xl! hover:-translate-y-3! ${plan.popular ? "border-secondary! bg-gradient-to-br! from-blue-50! to-white!" : "border-gray-200! bg-white!"}`}>
                                {plan.popular && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                                        <Tag color="blue" className="px-5! py-1! text-sm! rounded-full!">
                                            Most Popular
                                        </Tag>
                                    </div>
                                )}
                                <Title level={3} className="mb-1! font-bold!">
                                    {plan.name}
                                </Title>
                                <Text className="text-gray-500!">{plan.label}</Text>
                                <div className="mt-6 mb-4">
                                    <span className="text-4xl font-bold text-primary">
                                        Rs {price.toLocaleString()}
                                    </span>
                                    <span className="text-gray-400 ml-2">/ {billing}</span>
                                    {billing === "yearly" && (
                                        <div className="text-green-600 text-sm mt-1">
                                            You save 25% annually
                                        </div>
                                    )}
                                </div>
                                <Paragraph className="text-gray-50! mb-3!">
                                    {plan.transactionFee}
                                </Paragraph>
                                <div className="space-y-4 mb-10 flex-1">
                                    {plan.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-3 text-gray-700">
                                            <CheckOutlined className="text-secondary!" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button onClick={()=>navigate('/auth/seller/signup')} type={plan.popular ? "primary" : "default"} block size="large" className={`rounded-xl! font-semibold! mt-auto! ${plan.popular ? "bg-secondary! border-none! hover:bg-secondary!" : "border-gray-300!"}`}>
                                    {plan.cta}
                                </Button>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default PricingPlans;