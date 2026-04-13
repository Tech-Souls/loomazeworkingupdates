// import React from 'react';
// import { Typography } from 'antd';

// const { Title, Paragraph, Text, Link } = Typography;

// export default function CancellationRefundPolicy() {
//   return (
//     <>
//       <div className="bg-[var(--primary)]/20 text-[var(--primary)] px-3 py-6">
//         <Title level={2} className="text-center">
//           Cancellation & Refund Policy
//         </Title>
//       </div>

//       <section className="bg-white py-12">
//         <div className="w-full max-w-4xl mx-auto px-2">
//           <Typography className="space-y-6 text-[var(--text)]">
//             <Title level={3}>Cancellation & Refund Policy for Loomaze</Title>

//             <Paragraph>
//               Last updated: <Text strong>{new Date().toLocaleDateString()}</Text>
//             </Paragraph>

//             <Paragraph>
//               Loomaze (“we”, “our”, “us”) provides digital services and subscriptions. All payments for Loomaze products and services are processed by our merchant of record, Paddle.com.
//             </Paragraph>

//             <Title level={4}>Refund Policy</Title>
//             <Paragraph>
//               If you are a consumer located in the European Union, United Kingdom, or other applicable jurisdictions, you are entitled to a 14-day refund period in accordance with Paddle’s consumer terms.
//             </Paragraph>
//             <Paragraph>
//               You may request a full refund within 14 days of your initial purchase, provided the request is submitted within this period.
//             </Paragraph>
//             <Paragraph>
//               To request a refund, please contact Paddle directly using the receipt email you received after purchase or by visiting: <Link href="https://www.paddle.com/help" target="_blank">https://www.paddle.com/help</Link>
//             </Paragraph>
//             <Paragraph>
//               Refunds are issued by Paddle to the original payment method used at checkout.
//             </Paragraph>

//             <Title level={4}>After the Refund Period</Title>
//             <Paragraph>
//               Refund requests submitted after the 14-day refund window may not be eligible for a refund.
//             </Paragraph>

//             <Title level={4}>Subscription Cancellation</Title>
//             <Paragraph>
//               You may cancel your subscription at any time. Upon cancellation:
//             </Paragraph>
//             <ul className="list-disc ml-6">
//               <li>You will continue to have access to the service until the end of your current billing period.</li>
//               <li>No further charges will be made after cancellation.</li>
//               <li>Cancellation does not automatically trigger a refund for the current billing cycle unless requested within the 14-day refund period.</li>
//             </ul>

//             <Title level={4}>Contact Information</Title>
//             <Paragraph>
//               For billing, payment, or refund-related inquiries, please contact Paddle: <Link href="https://www.paddle.com/help" target="_blank">https://www.paddle.com/help</Link>
//             </Paragraph>
//             <Paragraph>
//               For general questions about Loomaze services, you may contact us at: <Link href="mailto:support@loomaze.com">support@loomaze.com</Link>
//             </Paragraph>
//           </Typography>
//         </div>
//       </section>
//     </>
//   );
// }

import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph, Text, Link } = Typography;

export default function CancellationRefundPolicy() {
  return (
    <>
      <div className="bg-[var(--primary)]/20 text-[var(--primary)] px-3 py-6">
        <Title level={2} className="text-center">
          Cancellation & Refund Policy
        </Title>
      </div>

      <section className="bg-white py-12">
        <div className="w-full max-w-4xl mx-auto px-2">
          <Typography className="space-y-6 text-[var(--text)]">

            <Paragraph>
              <Text strong>Loomaze</Text> provides subscription-based digital services. This policy explains our rules regarding free trials, subscriptions, manual payments, cancellations, and refunds, in accordance with the laws of the Islamic Republic of Pakistan.
            </Paragraph>

            <Title level={4}>Free Trial Policy (3 Days)</Title>
            <ul className="list-disc ml-6">
              <li>Loomaze offers a 3-day free trial on selected subscription plans.</li>
              <li>No charges are applied during the trial period.</li>
              <li>Users may cancel the subscription at any time during the trial to avoid being charged.</li>
              <li>If the trial is not canceled before expiration, the subscription will be automatically billed (for automated billing users).</li>
            </ul>

            <Title level={4}>Subscription Activation</Title>
            <Paragraph>Subscriptions may be activated in two ways:</Paragraph>

            <Title level={5}>1. Automated Billing</Title>
            <ul className="list-disc ml-6">
              <li>Payment is processed through an online payment gateway.</li>
              <li>Access is granted immediately after successful payment.</li>
            </ul>

            <Title level={5}>2. Manual Billing</Title>
            <ul className="list-disc ml-6">
              <li>Users may make payment through manual methods (e.g., bank transfer, wallet transfer).</li>
              <li>Users must submit a payment screenshot or proof to Loomaze.</li>
              <li>Subscription activation begins only after payment verification by our team.</li>
              <li>Loomaze is not responsible for delays caused by incorrect or unclear payment proofs.</li>
            </ul>

            <Title level={4}>Subscription Cancellation</Title>
            <ul className="list-disc ml-6">
              <li>Users may cancel their subscription at any time by contacting us or through their account (if available).</li>
              <li>After cancellation, access remains active until the end of the current billing period.</li>
              <li>No further charges will be applied after cancellation.</li>
            </ul>

            <Title level={4}>Refund Policy</Title>

            <Title level={5}>Subscription Fees</Title>
            <ul className="list-disc ml-6">
              <li>All subscription fees are non-refundable once the plan is activated, whether paid via automated billing or manual billing.</li>
              <li>This is because access to digital services is provided immediately after activation.</li>
              <li>Partial refunds for unused time are not offered.</li>
            </ul>

            <Title level={5}>Manual Billing Payments</Title>
            <ul className="list-disc ml-6">
              <li>Payments made via manual billing are strictly non-refundable once the plan has been activated.</li>
              <li>Loomaze is not responsible for payments sent to incorrect accounts or without proper confirmation.</li>
            </ul>

            <Title level={4}>Exceptional Refund Cases</Title>
            <Paragraph>Refunds may be considered only in the following cases:</Paragraph>
            <ul className="list-disc ml-6">
              <li>Duplicate payment for the same subscription</li>
              <li>Incorrect charge caused by Loomaze’s system error</li>
              <li>Prolonged service outage solely caused by Loomaze</li>
            </ul>

            <Paragraph><Text strong>Conditions:</Text></Paragraph>
            <ul className="list-disc ml-6">
              <li>Refund requests must be submitted within 7 days of payment</li>
              <li>Approved refunds are processed within 7–10 working days</li>
              <li>Refunds are issued using the original payment method, where possible</li>
            </ul>

            <Title level={4}>Plan Changes (Upgrade / Downgrade)</Title>
            <ul className="list-disc ml-6">
              <li>Users may upgrade or downgrade their subscription at any time.</li>
              <li>Plan changes may take effect immediately or from the next billing cycle, depending on the plan.</li>
              <li>Any price differences will be adjusted accordingly.</li>
            </ul>

            <Title level={4}>Account Suspension or Termination</Title>
            <Paragraph>Loomaze reserves the right to suspend or terminate accounts without refund if:</Paragraph>
            <ul className="list-disc ml-6">
              <li>Terms of Service are violated</li>
              <li>Fraudulent or abusive activity is detected</li>
              <li>Chargebacks or disputes are initiated without prior communication</li>
            </ul>

            <Title level={4}>Non-Refundable Items</Title>
            <ul className="list-disc ml-6">
              <li>Subscription fees after trial expiration</li>
              <li>Activated subscriptions (manual or automated)</li>
              <li>Setup fees (if applicable)</li>
              <li>Add-ons or custom services</li>
            </ul>

            <Title level={4}>Contact Information</Title>
            <Paragraph>
              Email: <Link href="mailto:contact@loomaze.com">contact@loomaze.com</Link>
            </Paragraph>
            <Paragraph>
              Phone: <Text>0319-2516217</Text>
            </Paragraph>
            <Paragraph>
              Website: <Link href="https://loomaze.com" target="_blank">https://loomaze.com</Link>
            </Paragraph>

            <Title level={4}>Governing Law</Title>
            <Paragraph>
              This policy is governed by and interpreted in accordance with the laws of Pakistan.
            </Paragraph>

          </Typography>
        </div>
      </section>
    </>
  );
}
