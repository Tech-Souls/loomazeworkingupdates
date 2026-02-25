
// \import React from "react";
// import ContactImg from "../../assets/images/contact-map.webp";

// export default function AboutContact() {
//   return (
//     <section
//       className="relative bg-white xl:bg-no-repeat xl:bg-right xl:bg-contain"
//       style={{ backgroundImage: `url(${ContactImg})` }}
//     >
//       <div className="max-w-[1400px] mx-auto px-4 xl:px-[clamp(2.9rem,2.8vw+2.9rem,6rem)] relative z-10">
//         <div className="flex flex-wrap justify-center xl:justify-start -mx-3">
//           <div className="w-full md:w-9/12 xl:w-5/12 px-3">
//             <div className="border md:border border-[#151f20] bg-white m-6 md:m-16 rounded-lg overflow-hidden shadow">
              
//               {/* Head section */}
//               <div className="py-6 px-6 md:pt-10 md:pr-24 md:pb-10 md:pl-14">
//                 <h2 className="text-3xl font-bold">Let’s Work Together</h2>
//                 <p className="text-gray-600 mt-2">
//                   We love to meet up with you to discuss your venture, and
//                   potential collaborations.
//                 </p>
//               </div>

//               {/* Body section */}
//               <div className="p-4 md:p-14   bg-[#151f20] text-white">
//                 <table className="w-full text-left border-collapse">
//                   <tbody>
//                     <tr>
//                       <th className="pr-4 font-semibold">Email:</th>
//                       <td>sales@fatbit.com</td>
//                     </tr>
//                     <tr>
//                       <th className="pr-4 font-semibold">Phone No:</th>
//                       <td>+1 256 792 5883</td>
//                     </tr>
//                     <tr>
//                       <th className="pr-4 font-semibold">Address:</th>
//                       <td>
//                         ITC 3, Sector 67, Mohali, Punjab - 160062, India
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import React from "react";
import ContactImg from "../../assets/images/contact-map.webp";

export default function AboutContact() {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="hidden xl:block absolute right-0 top-0 bottom-0 w-[1120px]">
        <img
          src={ContactImg}
          alt="Contact Map"
          className="h-full w-full object-contain"
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 xl:px-[clamp(2.9rem,2.8vw+2.9rem,6rem)] relative z-10">
        <div className="flex flex-wrap justify-center xl:justify-start -mx-3">
          <div className="w-full md:w-9/12 xl:w-5/12 px-3">
            <div className="border md:border border-[#151f20] bg-white m-6 md:m-16 rounded-lg overflow-hidden shadow">
              
              {/* Head section */}
              <div className="py-6 px-6 md:pt-10 md:pr-24 md:pb-10 md:pl-14">
                <h2 className="text-3xl font-bold">Let’s Work Together</h2>
                <p className="text-gray-600 mt-2">
                  We love to meet up with you to discuss your venture, and
                  potential collaborations.
                </p>
              </div>

              {/* Body section */}
              <div className="p-4 md:p-14 bg-[#151f20] text-white">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr>
                      <th className="pr-4 font-semibold">Email:</th>
                      <td>sales@fatbit.com</td>
                    </tr>
                    <tr>
                      <th className="pr-4 font-semibold">Phone No:</th>
                      <td>+1 256 792 5883</td>
                    </tr>
                    <tr>
                      <th className="pr-4 font-semibold">Address:</th>
                      <td>
                        ITC 3, Sector 67, Mohali, Punjab - 160062, India
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
