// import React from 'react'
// import featuredImg from '../../assets/images/featured.svg'
// import trustImg from '../../assets/images/trust.svg'
// import awardImg from '../../assets/images/award.svg'

// export default function AnoutHighlights() {
//   return (
//     <div>
//       <section>
//         <div className="containear">
//             <div className='section_headeer'>
//                 <div className='row justify-center flex'>
//                     <div className='col-xl-9'>
//                         <div className='cms text-center'>
//                             <h2>Making An Impact Since 2015</h2>
//                             <p className='p--large'>
//                                 An impactful launch backed by a brilliant response encouraged the FATbit team to invest more in multi-vendor software. loomaze transformed FATbit’s dynamics, enhancing its image from a web development company to a leading technology partner in eCommerce. Today, a dedicated team continuously works on implementing operative increments using agile development methodologies.


//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className='loomaze-highlight flex bg-[var(--secondary)]'>
//                 <div className='highlight-box'>
//                     <span className='hightlight-box__icons'>
//                       <img src={featuredImg} alt="Featured" height={52} width={43} loading='lazy'/>
//                     </span>
//                     <h2>Featured 3 Times in a Row on Inc.’s List of Best eCommerce Platforms</h2>
//                 </div>
//                 <div className='highlight-box'>
//                     <span className='hightlight-box__icons'>
//                       <img src={trustImg} alt="Featured" height={52} width={43} loading='lazy'/>
//                     </span>
//                     <h2>Featured 3 Times in a Row on Inc.’s List of Best eCommerce Platforms</h2>
//                 </div>
//                 <div className='highlight-box'>
//                     <span className='hightlight-box__icons'>
//                       <img src={awardImg} alt="Featured" height={52} width={43} loading='lazy'/>
//                     </span>
//                     <h2>Featured 3 Times in a Row on Inc.’s List of Best eCommerce Platforms</h2>
//                 </div>
//             </div>

//             <div className='rating-wrapper'>
//               <div className="rating-wrapper">
//                         <div className="rating__col">
//                             <div className="rating__provider">
//                                 Software Suggest
//                             </div>
//                             <div className="rating__detail">
//                                 <span className='rating__count'>4.9</span>
//                                 <span className='rating__stars'>
//                                     <i data-star="4.9" style={{ "--rating": 4.9 }}></i>
//                                     </span>
//                             </div>
//                         </div>
//                         <div className="rating__col">
//                             <div className="rating__provider">
//                                 Goodfirms
//                             </div>
//                             <div className="rating__detail">
//                                 <span className='rating__count'>4.8</span>
//                                     <span className='rating__stars'>
//                                     <i data-star="4.8" style={{ "--rating": 4.8}}></i>
//                                     </span>

//                             </div>
//                         </div>
//                         <div className="rating__col">
//                              <div className="rating__provider">
//                                 Capterra
//                             </div>
//                             <div className="rating__detail">
//                                 <span className='rating__count'>4.3</span>
//                                <span className='rating__stars'>
//                                     <i data-star="4.3" style={{ "--rating": 4.3 }}></i>
//                                     </span>
//                             </div></div>                       
//                         <div className="rating__col">
//                             <div className="rating__provider">
//                                 G2
//                             </div>
//                             <div className="rating__detail">
//                                 <span className='rating__count'>4.6</span>
//                                 <span className='rating__stars'>
//                                     <i data-star="4.6" style={{ "--rating": 4.6 }}></i>
//                                     </span>
//                             </div>
//                         </div>
//                     </div>
//             </div>
//         </div>
//       </section>
//     </div>
//   )
// }
import React from 'react'
import featuredImg from '../../assets/images/featured.svg'
import trustImg from '../../assets/images/trust.svg'
import awardImg from '../../assets/images/award.svg'

export default function AboutHighlights() {
  const highlights = [
    {
      icon: featuredImg,
      text: "Featured 3 Times in a Row on Inc.’s List of Best eCommerce Platforms"
    },
    {
      icon: trustImg,
      text: "Trusted by 500+ Businesses Across 70+ Countries"
    },
    {
      icon: awardImg,
      text: "Awarded as the Most Customizable eCommerce Platform"
    }
  ]

  const ratings = [
    { provider: "Software Suggest", score: 4.9 },
    { provider: "Goodfirms", score: 4.8 },
    { provider: "Capterra", score: 4.3 },
    { provider: "G2", score: 4.6 },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">

        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-semibold mb-4">Making An Impact Since 2015</h2>
         <p className="text-base md:text-lg text-[var(--text)] leading-relaxed">
          An impactful launch backed by a brilliant response encouraged the
            <span className="bg-[#089cb9e8] text-white px-2 py-1 md:px-3 md:py-1.5 rounded-3xl mx-1 inline-block">
              FATbit
            </span>
            team to invest more in multi-vendor software. loomaze transformed FATbit’s dynamics,
            enhancing its image from a web development company to a leading technology
            partner in eCommerce. Today, a dedicated team continuously works on implementing
            operative increments using agile development methodologies.
          </p>

        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-white p-8 md:p-16 rounded-lg"
          style={{
            background: "linear-gradient(150deg, #02bcc8 0%, #19b0ba 50%, #028ec8 100%)"
          }}
        >
          {highlights.map((item, idx) => (
            <div key={idx} className="flex flex-col items-start">
              <span className="block min-h-[52px] mb-4">
                <img src={item.icon} alt="Highlight" className="h-[52px] w-auto" loading="lazy" />
              </span>
              <h2 className="text-xl md:text-2xl font-semibold">{item.text}</h2>
            </div>
          ))}
        </div>

        {/* Ratings */}
         <div className="flex flex-wrap justify-center gap-5">
      {ratings.map((rate, idx) => (
        <div key={idx} className="flex-1 min-w-[200px] text-center">
          {/* Provider Name */}
          <div className="font-semibold mb-1">{rate.provider}</div>

          {/* Rating Score + Stars */}
          <div className="flex justify-center items-center gap-2">
            <span className="font-bold text-lg">{rate.score}</span>
            <span className="text-xl">
              <span
                style={{
                  background: `linear-gradient(90deg, #FFD700 ${rate.score * 20}%, #000 ${rate.score * 20}%)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontStyle: "normal"
                }}
              >
                {"★★★★★"}
              </span>
            </span>
          </div>
        </div>
      ))}
    </div>
      </div>
    </section>
  )
}
