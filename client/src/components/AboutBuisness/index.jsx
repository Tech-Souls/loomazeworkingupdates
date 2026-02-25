import React from "react";

export default function AboutBusiness() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">

        <h2 className="text-3xl font-semibold mb-4">About Us</h2>
        <p className="text-lg text-gray-700 mb-4">
          Loomaze is a modern e-commerce platform designed to help brands and
          businesses create and run their own online stores with ease.
        </p>
        <p className="text-lg text-gray-700 mb-8">
          We believe every brand deserves the freedom to sell online under its
          own identity. Loomaze provides the tools and technology needed to
          build, manage, and grow an online store without complexity.
        </p>

        <h3 className="text-2xl font-semibold mb-3">Our Platform</h3>
        <p className="text-lg text-gray-700 mb-3">
          Loomaze allows businesses to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 mb-4">
          <li>Create their own online store</li>
          <li>Customize store design and content</li>
          <li>Add and manage products</li>
          <li>Track orders and manage customers</li>
          <li>Grow their brand online</li>
        </ul>
        <p className="text-lg text-gray-700 mb-8">
          Each business operates independently on Loomaze, giving full control
          over their store, products, and customer experience.
        </p>

        <h3 className="text-2xl font-semibold mb-3">Who Loomaze Is For</h3>
        <p className="text-lg text-gray-700 mb-3">
          Loomaze is built for:
        </p>
        <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 mb-8">
          <li>Small and growing businesses</li>
          <li>Independent brands</li>
          <li>Startups launching their first online store</li>
          <li>Businesses looking for a simple, scalable e-commerce solution</li>
        </ul>

        <h3 className="text-2xl font-semibold mb-3">Our Mission</h3>
        <p className="text-lg text-gray-700 mb-8">
          Our mission is to make e-commerce simple, accessible, and powerful
          for everyone. We focus on building a platform that helps businesses
          succeed online while maintaining full ownership of their brand and
          customers.
        </p>

        <h3 className="text-2xl font-semibold mb-3">Why Choose Loomaze</h3>
        <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 mb-8">
          <li>Easy-to-use store management tools</li>
          <li>Flexible and scalable platform</li>
          <li>Built for brand independence</li>
          <li>Reliable and continuously improving technology</li>
        </ul>

        <h3 className="text-2xl font-semibold mb-3">Our Vision</h3>
        <p className="text-lg text-gray-700 mb-8">
          We aim to become a trusted platform where businesses can confidently
          build and grow their online presence, reach customers globally, and
          create lasting brands.
        </p>

        <h3 className="text-2xl font-semibold mb-3">Get in Touch</h3>
        <p className="text-lg text-gray-700">
          Have questions or want to learn more about Loomaze?
        </p>
        <p className="text-lg text-gray-700">
          Email: <a href="mailto:support@loomaze.com" className="text-blue-600 underline">support@loomaze.com</a>
        </p>
        <p className="text-lg text-gray-700">
          Website: <a href="https://www.loomaze.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://www.loomaze.com</a>
        </p>

      </div>
    </section>
  );
}
