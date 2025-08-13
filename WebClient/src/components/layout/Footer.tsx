import React from "react";
import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  {
    name: "GitHub",
    image: "/images/github.svg",
    link: "https://github.com/Web-Affan-Farooq/employee-management-system.git",
  },
  {
    name: "LinkedIn",
    image: "/images/linkedin.svg",
    link: "https://www.linkedin.com/in/muhammad-affan",
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black text-white py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo or Brand */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-semibold">WorkHive</h2>
          <p className="text-gray-400 text-sm mt-2">
            Empowering teams through structured organization
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          {socialLinks.map((social, idx) => (
            <Link
              key={idx}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
            >
              <div className="p-2 bg-white rounded-full hover:scale-110 transition duration-200 shadow-lg">
                <Image src={social.image} alt={social.name} width={15} height={15} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Divider and Bottom Text */}
      <div className="border-t border-gray-800 mt-8 pt-4 text-center text-sm text-gray-500">
        &copy; {currentYear} Muhammad Affan — All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
