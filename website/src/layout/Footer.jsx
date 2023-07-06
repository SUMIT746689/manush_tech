import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import {
  AiOutlineTwitter,
  AiOutlineGooglePlus,
  AiOutlineYoutube,
  AiOutlineLinkedin,
} from "react-icons/ai";

const primaryBgColor = "bg-sky-700";
const primaryColor = "text-sky-100";
const whiteColor = "text-gray-100";
const secondaryColor = "text-sky-700";

const footerIconClass =
  "cursor-pointer p-3 text-5xl w-14 h-14 rounded-full shadow-sm shadow-black hover:rotate-[360deg] duration-500 scale-1.1";

function Footer() {
  return (
    <>
      <footer
        className={`${primaryBgColor} ${primaryColor} py-4 px-20 grid md:grid-cols-2 justify-between`}
      >
        <div className=" relative top-4 mb-4 text-center md:text-left">
          ©Copyright© 2023 Elitbuzz Technologies Limited . All Rights Reserved.
        </div>
        <div className=" text-2xl flex gap-2 pt-3 md:pt-0 justify-center md:justify-end">
          <FaFacebookF className={footerIconClass} />
          <AiOutlineTwitter className={footerIconClass} />
          <AiOutlineGooglePlus className={footerIconClass} />
          <AiOutlineYoutube className={footerIconClass} />
          <FaLinkedinIn className={footerIconClass} />
        </div>
      </footer>
    </>
  );
}

export default Footer;
