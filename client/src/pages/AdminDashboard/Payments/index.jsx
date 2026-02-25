import { Route, Routes } from 'react-router-dom';
import InvoiceHistory from './InvoiceHistory';

const Payments = () => {
    return (
        <Routes>
            <Route path='all-invoices' element={<InvoiceHistory />} />
        </Routes>
    )
}

export default Payments;