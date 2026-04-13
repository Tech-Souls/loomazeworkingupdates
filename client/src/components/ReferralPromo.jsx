import { Typography, Button, Card } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

const ReferralPromo = () => {
    const navigate = useNavigate();

    return (
        <section className="py-15 bg-[#fafafa] overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                <div data-aos="fade-right" data-aos-duration="900">
                    <Title level={2} data-aos="zoom-in" data-aos-delay="100">
                        Earn money by promoting <span className="text-primary!">loomaze</span>
                        <button onClick={() => navigate('/auth/seller/login')} className="inline-block  bg-primary text-white py-1 px-3 rounded-md font-bold text-lg tracking-wide  transition-all ml-1 md:ml-3 lg:ml-1">
                            Start for free
                        </button>
                    </Title>
                    <Paragraph className="text-gray-600! text-lg!" data-aos="fade-up" data-aos-delay="200">
                        Loomaze offers a built-in referral system. Share Loomaze with sellers,
                        factories, and brands — and earn <Text strong>5% lifetime commission</Text> on every plan they purchase.
                    </Paragraph>
                    <div className="mt-6 space-y-4">
                        <div data-aos="fade-up" data-aos-delay="300">
                            <Text strong>How it works</Text>
                            <ul className="list-disc ml-6 mt-2 text-gray-600">
                                <li>You get a unique referral link</li>
                                <li>You invite sellers to Loomaze</li>
                                <li>They purchase a plan</li>
                                <li>You earn commission from every payment</li>
                            </ul>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg" data-aos="fade-up" data-aos-delay="400">
                            <Text className="text-green-700!">
                                No limits. No expiry. Earn as long as your sellers stay active.
                            </Text>
                        </div>
                    </div>
                    <div className="mt-8" data-aos="zoom-in" data-aos-delay="500">
                        <Button type="primary" size="large" onClick={() => navigate("/auth/signup")}>
                            Join Referral Program
                        </Button>
                    </div>
                </div>

                <Card className="shadow-lg rounded-xl" data-aos="fade-left" data-aos-duration="900">
                    <Title level={4}>
                        Why people love <span className="text-primary">loomaze</span> referrals
                    </Title>
                    <div className="mt-6 space-y-5">
                        <div data-aos="fade-up" data-aos-delay="200">
                            <Text strong>💰 Passive Income</Text>
                            <Paragraph type="secondary">
                                Earn while sellers run their business.
                            </Paragraph>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="300">
                            <Text strong>📈 Scales with Growth</Text>
                            <Paragraph type="secondary">
                                More sellers = more long-term income.
                            </Paragraph>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="400">
                            <Text strong>🚀 Easy to Share</Text>
                            <Paragraph type="secondary">
                                One link is all you need to start earning.
                            </Paragraph>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    );
}

export default ReferralPromo;