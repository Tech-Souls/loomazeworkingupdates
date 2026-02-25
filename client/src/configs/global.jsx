import { message } from "antd";

let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

window.isEmail = email => emailRegex.test(email);

window.toastify = (msg = "", type) => {
    switch (type) {
        case 'success': message.success(msg); break;
        case 'error': message.error(msg); break;
        case 'info': message.info(msg); break;
        case 'warning': message.warning(msg); break;
        default: message.info(msg);
    }
}

window.api = import.meta.env.VITE_HOST

window.verify = {
    cnic: { pattern: /^\d{5}-\d{7}-\d{1}$/, message: "Format: XXXXX-XXXXXXX-X" },
    phone: { pattern: /^(03\d{2}-\d{7}|03\d{9})$/, message: "Invalid Pakistani phone number." },
};