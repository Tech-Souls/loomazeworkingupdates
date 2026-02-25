import  { useState } from "react";
import { Typography, Divider } from "antd";
import { ChevronDown } from "lucide-react";
import { faqData } from "../data/faq.jsx"
const { Title, Paragraph, Text } = Typography;


const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const renderAnswer = (text) => {
    const lines = text.split("\n").filter(Boolean);

    if (lines.length > 1) {
      return (
        <ul className="space-y-2">
          {lines.map((line, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-primary font-bold">•</span>
              <Text className="text-gray-300!">{line}</Text>
            </li>
          ))}
        </ul>
      );
    }
    return <Paragraph className="text-gray-300!">{text}</Paragraph>;
  };

  return (
    <section className="bg-black py-16">
      <div className="max-w-4xl mx-auto px-4">
        <Title level={2} className="text-white! text-center!">
          Frequently Asked <span className="text-primary">Questions</span>
        </Title>

        <Divider className="border-gray-700!" />
        <div className="space-y-5 mt-10">
          {faqData.map((item, index) => (
            <div key={index} className="border border-gray-800 rounded-xl bg-gradient-to-br from-gray-900 to-black overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex justify-between items-center px-6 py-5 text-left">
                <Text className="text-white! text-lg! font-semibold!">
                  {item.question}
                </Text>
                <ChevronDown className={`w-5! h-5! text-primary! transition-transform! duration-300! ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              
              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openIndex === index ? "max-h-[600px] px-6 pb-6" : "max-h-0 px-6"}`}>
                <div className="border-t border-gray-800 pt-4">
                  {renderAnswer(item.answer)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQs;