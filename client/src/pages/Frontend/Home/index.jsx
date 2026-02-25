import Hero from './Hero'
import Services from './Services'
import Adminfeatures from './AdminFeatures'
import Referral from '@/components/ReferralPromo'
import PricingPlans from '@/components/PricingPlans'
import FAQs from '@/components/FAQs'

export default function Home() {
    return (
        <div>
            <Hero />
            <Services />
            <PricingPlans />
            <Adminfeatures />
            <Referral />
            <FAQs />
        </div>
    )
}