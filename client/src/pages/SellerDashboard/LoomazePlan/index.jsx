import { Route, Routes } from 'react-router-dom'
import DepositForm from './DepositForm'
import InvoiceHistory from './InvoiceHistory'
const LoomazePlan = () => {
    return (
        <Routes>
            <Route path="deposit" element={<DepositForm />} />
            <Route path="invoice-history" element={<InvoiceHistory />} />
        </Routes>
    )
}

export default LoomazePlan