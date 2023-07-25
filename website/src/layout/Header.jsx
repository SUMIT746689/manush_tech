import Image from "next/image";

function Header({header_image}) {
  return <Image className=" max-h-80 object-cover w-screen" width={1500} height={200} src={`${process.env.SERVER_HOST}/${header_image.replace(/\\/g, '/')}`} />;
  // return <Image width={1500} height={400} src={``} />;
}

export default Header;
