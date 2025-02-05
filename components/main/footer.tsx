import Link from "next/link";
import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { jura } from "@/fonts/fonts";


type Props = {
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
};

const Footer = (props: Props) => {
  return (
    <footer className={`${jura.className} bg-[#ffffff] px-6 py-4 flex flex-col md:flex-row justify-center md:justify-between items-center gap-3 w-full text-center md:text-left relative z-50 mt-auto`}>
      <p className="text-black font-semibold flex flex-wrap justify-center md:justify-start gap-1">
        Brought to you by <Link href={props.twitterUrl}><span className="underline hover:no-underline">Satyam</span></Link> 
      </p>
      <div className="flex gap-4">
        <Link href={props.githubUrl} className="hover:scale-110 transition-all" target="_blank">
          <FaGithub size={23} color="black"/>
        </Link>
        <Link href={props.twitterUrl} className="hover:scale-110 transition-all" target="_blank">
          <FaXTwitter size={23} color="black"/>
        </Link>
        <Link href={props.linkedinUrl} className="hover:scale-110 transition-all" target="_blank">
          <FaLinkedin size={23} color="black"/>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
