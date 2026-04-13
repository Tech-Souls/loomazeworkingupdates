import React from 'react'
import authorImg from '../../assets/images/about-author.webp'
import authorBgImg from '../../assets/images/author-bg.webp'

export default function AboutAuthor() {
  return (
    <section
      className="section--author section bg-white bg-no-repeat bg-center bg-cover py-12"
      style={{ backgroundImage: `url(${authorBgImg})` }}
    >
      <div className="container w-full md:max-w-[720px] mx-auto px-4 bg-[#fff]">
        <div className="author flex flex-col md:flex-row items-center gap-8">
          
          {/* Author Image */}
          <div className="author__img flex-none w-full max-w-full md:w-[355px] md:max-w-[355px] hidden md:block">
  <picture className="block">
    <img
      src={authorImg}
      alt="Founder & CEO"
      height={565}
      width={355}
      className="block w-full h-auto"
    />
  </picture>
</div>

          {/* Author Info */}
          <div className="author__info text-center md:text-left">
            <div className="author__statement mb-4 text-[1.375rem] leading-snug font-extrabold">
              <strong>
                In 2002, I started my journey with a vision of accelerating the
                entrepreneurial journey by providing a high-end yet affordable
                digital solution.
              </strong>
            </div>
            <div className="author__detail">
              <div className="name text-2xl font-bold">Mr. Manish Bhalla</div>
              <div className="designation text-[--text]">
                CEO and Founder
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
