import React from 'react';
import Link from 'next/link';

const links = [
    {
        name: "Login to your organization",
        link: "/login-org",
    },
    {
        name: "Create organization",
        link: "/create-org",
    },
    {
        name: "Login as employee",
        link: "/login-employee",
    },
    {
        name: "Create account",
        link: "/create-employee",
    },
]
const Section_1 = () => {
    return (
        <div>
            <br />
            <br /><br />
            <section className='px-1 md:px-10 py-36 text-center' id='section-1'>
                <div className='w-full text-left p-4'>
                    <h1 className='text-5xl md:text-6xl leading-16 font-bold'>
                        A collective place for all your organization needs</h1>
                    <br />
                    <br />
                    <p className='text-[15px] text-gray-700'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas minima ex molestiae quidem repellendus veniam quo quas dolorum. Vel fugiat tenetur perspiciatis tempore qui, veritatis similique corrupti? Pariatur, laborum labore.</p>
                    <br />
                    <div className='flex flex-row flex-wrap gap-[10px] sm:w-1/2'>
                        {links.map((link, idx) => (
                            <Link href={link.link} key={idx}>
                                <button type="button" className='bg-black cursor-pointer text-white px-[10px] py-[5px] rounded-lg font-semibold'>{link.name}</button>
                            </Link>
                        ))}
                    </div>
                </div>
                <br />
                {/* <Button type='?'/> */}
            </section>
        </div>
    )
}

export default Section_1;


// import React from "react";
// import Image from "next/image";

// const Section_1 = () => {
//   return (
//     <section className="w-full bg-black flex flex-row flex-wrap gap-10 justify-evenly items-center max-[850px]:flex-col-reverse">
//       <div className="w-[440px] max-sm:w-[400px] p-5">
//         <span className="text-gray-400 text-[18px]">KEEP YOUR MONEY SAFE</span>
//         <br />
//         <h1 className="font-bold text-[45px] leading-1">
//           <span className="hero-text">Best crypto</span>
//           <br />
//           <span className="text-green">investing platform</span>
//           <br />
//           <span className="hero-text">for your future</span>
//         </h1>
//         <br />
//         <div className="border-y-2 border-solid border-gray-400 flex flex-row flex-nowrap justify-between">
//           <div className="py-5 flex flex-row flex-nowrap ">
//             <Image
//               src={"/images/hero/1.jpg"}
//               alt="member image"
//               width={50}
//               height={50}
//               className="object-cover w-[50px] h-[50px] rounded-full relative"
//             />
//             <Image
//               src={"/images/hero/2.jpg"}
//               alt="member image"
//               width={50}
//               height={50}
//               className="object-cover w-[50px] h-[50px] rounded-full relative right-5 z-2"
//             />
//             <Image
//               src={"/images/hero/3.jpg"}
//               alt="member image"
//               width={50}
//               height={50}
//               className="object-cover w-[50px] h-[50px] rounded-full relative right-10"
//             />
//             <Image
//               src={"/images/hero/4.jpg"}
//               alt="member image"
//               width={50}
//               height={50}
//               className="object-cover w-[50px] h-[50px] rounded-full relative right-16"
//             />
//             <Image
//               src={"/images/hero/5.jpg"}
//               alt="member image"
//               width={50}
//               height={50}
//               className="object-cover w-[50px] h-[50px] rounded-full relative right-20"
//             />
//             <Image
//               src={"/images/hero/6.jpg"}
//               alt="member image"
//               width={50}
//               height={50}
//               className="object-cover w-[50px] h-[50px] rounded-full relative right-24"
//             />
//           </div>

//           <div className="text-gray-400">
//             <span className="text-3xl text-gray-400 font-bold">168K +</span>
//             <p>Realtime users</p>
//           </div>

//         </div>
// <br />
//         <div className="flex flex-row flex-nowrap gap-5 justify-center items-center">
//           <div className="bg-green w-[50px] h-[50px] rounded-full text-2xl text-center flex justify-center items-center -rotate-45 text-white">
//             <i className="fa-solid fa-arrow-right"></i>
//           </div>

//           <p className="text-gray-400 w-[70%] text-[15px]">
//             Lorem ipsum dolor sit amet consectetur adipisicing elitctio voluptatem, odit eligendi ad sequi vero
//             consequuntur in
//           </p>
//         </div>
//       </div>

//       <div className="border-2 border-solid border-white">
//         <Image
//           src={"/globe.svg"}
//           alt="hero images"
//           width={350}
//           height={350}
//           className="object-cover"
//         />
//       </div>
//     </section>
//   );
// };

// export default Section_1;