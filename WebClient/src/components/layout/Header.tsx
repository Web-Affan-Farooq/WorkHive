"use client";
import { useRef, useState } from 'react'
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
// import { useScrollDirection } from "../../../hooks";

gsap.registerPlugin(useGSAP)
const Header = () => {
  const [navStatus, setnavStatus] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  //   const showHeader = useScrollDirection();

  //   useGSAP(() => {
  //     if (showHeader) {
  //       gsap.to(".header", { y: 0, duration: 0.5, ease: "power2.out" });
  //     } else {
  //       gsap.to(".header", { y: -100, duration: 0.5, ease: "power2.out" });
  //     }
  //   }, { dependencies: [showHeader] });

  useGSAP(() => {
    const tl = gsap.timeline()
    tl.from(".nav-options", {
      y: -30,
      opacity: 0,
      duration: 0.8,
      delay: 0.6,
      stagger: 0.2,
      ease: "power2.out",
    });

    if (navStatus && window.innerWidth < 640) {
      gsap.from(".nav-options-mobile", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      });
    }

  }, { dependencies: [navStatus] });

  const handleSideNav = () => {
    setnavStatus(!navStatus)
  }

  return (
    <header className='header text-white bg-black font-bold z-20 fixed w-full rounded-2xl px-[40px] py-[10px] top-[3%]
    flex flex-row flex-wrap justify-between items-center max-sm:items-start' ref={headerRef}>
      <div className='logo font-bold font-firacode
      text-[25px] 
      2xl:text-[35px]
      xl:text-[33px]
      lg:text-[31px]
      '>
        WorkHive
      </div>
      <div className='flex flex-row flex-wrap justify-center items-center 
      2xl:gap-[80px]
      xl:gap-[60px]
      lg:gap-[45px]
      md:gap-[45px]
      sm:gap-[43px]
      max-sm:hidden'>
        <Link href={"/"} className='nav-options 2xl:text-[20px]'>Home</Link>
        <Link href={"/features"} className='nav-options 2xl:text-[20px]'>Features</Link>
        <Link href={"/pricing"} className='nav-options 2xl:text-[20px]'>Pricing</Link>
        <Link href={"/login"} className='nav-options 2xl:text-[20px]'>Login</Link>
      </div>

      <div className={clsx(`py-[100px] flex-col absolute -top-5 -left-10 bg-black w-[100vw] h-screen flex-wrap justify-center items-center gap-[40px] transition-all duration-400 ease-in-out hidden max-sm:flex`, {
        "-translate-x-0": navStatus,
        "-translate-x-[100vw]": !navStatus
      })}>
        <X className='text-white sm:hidden block absolute right-10 top-9' onClick={handleSideNav} />
        <Link href={"/"} className='nav-options-mobile text-white' onClick={() => {
          setnavStatus(!navStatus);
        }}>Home</Link>
        <Link href={"/login-org"} className='nav-options-mobile text-white' onClick={() => {
          setnavStatus(!navStatus);
        }}>Features</Link>
        <Link href={"/login-employee"} className='nav-options-mobile text-white' onClick={() => {
          setnavStatus(!navStatus);
        }}>Pricing</Link>
        <Link href={"/login-employee"} className='nav-options-mobile text-white' onClick={() => {
          setnavStatus(!navStatus);
        }}>Login</Link>
      </div>
        <Menu className='sm:hidden block absolute right-4 top-4' onClick={handleSideNav} /> 
      {/* <div className='md:block hidden'></div> */}
    </header>
  )
}

export default Header;