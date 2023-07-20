import Image from "next/image";

function Header({header_image}) {
  return <Image width={1500} height={400} src={`http://localhost:3000/${header_image.replace(/\\/g, '/')}`} />;
}

export default Header;
