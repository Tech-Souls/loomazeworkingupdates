import { Row, Col, Typography, Button } from "antd"
import { ThunderboltOutlined, DeploymentUnitOutlined, ArrowRightOutlined } from "@ant-design/icons"
import processImg from "@/assets/images/methodology.svg"
import { useNavigate } from "react-router-dom"

const { Title, Paragraph, Text } = Typography

function Feature({ icon, color, title, text }) {
  return (
    <div className="flex gap-5 p-6 bg-gray-50 rounded-2xl border hover:bg-white hover:shadow-lg transition">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl" style={{ backgroundColor: `${color}15`, color }}>
        {icon}
      </div>
      <div>
        <Title level={4} className="!mb-1">
          {title}
        </Title>
        <Paragraph className="!mb-0 !text-gray-500">{text}</Paragraph>
      </div>
    </div>
  )
}

const Process = () => {
  const navigate = useNavigate()
  return (
    <section className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-4xl mb-16" data-aos="fade-up">
          <Text className="block! mb-4! text-sm! font-bold! tracking-widest! text-primary! uppercase!">
            Delivery Framework
          </Text>
          <Title className="text-3xl! md:!text-4xl! font-bold! leading-tight!">
            Ecommerce Capability Building for Large Enterprises
          </Title>
          <Paragraph className="text-lg! md:text-xl! text-gray-600!">
            We apply <span className="font-medium text-gray-900">design thinking</span> and <span className="font-medium text-gray-900"> agile methodology</span> to deliver scalable, secure platforms through short, measurable sprints.
          </Paragraph>
        </div>
        <Row gutter={[32, 48]} align="middle">
          <Col xs={24} lg={8}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6" data-aos="fade-right">
              <Feature icon={<ThunderboltOutlined />} color="#F36734" title="Fast MVP Launch" text="Marketplace-ready MVPs delivered in weeks, optimized for speed-to-revenue." />
              <Feature icon={<DeploymentUnitOutlined />} color="#0795E6" title="Scalable Architecture" text="Microservice-based platforms that scale effortlessly with demand." />
            </div>

            <Button type="primary" size="large" className="mt-10! px-8! py-5! rounded-xl! font-bold! bg-primary!" onClick={() => navigate('/join-as-seller')}>
              Let’s Work Together <ArrowRightOutlined />
            </Button>
          </Col>
          <Col xs={0} lg={14} data-aos="fade-left">
            <img src={processImg} alt="Ecommerce methodology" className="hidden lg:block w-full max-w-3xl mx-auto" />
          </Col>
        </Row>
      </div>
    </section>
  )
}

export default Process;