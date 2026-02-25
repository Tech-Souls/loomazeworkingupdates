import { Modal } from "antd";
import { MailOutlined, PhoneOutlined, WhatsAppOutlined, MessageOutlined } from "@ant-design/icons";
const Card = ({ href, bg, iconBg, icon, label }) => (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-center justify-center transition hover:scale-105">
        <div className={`${bg} py-5 px-7 rounded-2xl text-center flex flex-col items-center justify-center w-36 h-36`}>
            <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center shadow-md mb-3`}>
                <div className="text-white text-3xl flex items-center justify-center leading-none">
                    {icon}
                </div>
            </div>
            <p className="font-bold text-sm text-gray-700 m-0">{label}</p>
        </div>
    </a>
);

const ContactInfoModal = ({ open, onClose }) => {
    return (
        <Modal open={open} onCancel={onClose} footer={null} centered closable={false} width={800} className="bg-transparent overflow-hidden rounded-2xl" title={<div className="w-full flex justify-center items-center gap-2 text-white font-bold uppercase text-lg bg-gradient-to-r from-primary to-secondary py-3 rounded-2xl"><MessageOutlined />                    <span>Contact Information</span></div>}>
            <div className="bg-white p-8 grid grid-cols-3 gap-6 items-center">
                <Card href="https://wa.me/923192516217" bg="bg-green-200" iconBg="bg-green-600" icon={<WhatsAppOutlined />} label="WhatsApp" />
                <Card href="mailto:support@loomaze.com" bg="bg-gray-200" iconBg="bg-gray-600" icon={<MailOutlined />} label="Email" />
                <Card href="tel:+923192516217" bg="bg-gray-200" iconBg="bg-gray-600" icon={<PhoneOutlined />} label="Phone" />
            </div>
        </Modal>
    );
}
export default ContactInfoModal