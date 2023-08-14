import Image from "next/image";

function Header({ eiin_number, header_image }) {
  
  return <div className=" relative">
    <div className=" absolute top-2 right-2 text-lg font-bold text-white bg-sky-700 rounded p-2">
      EIIN Number : {eiin_number}
    </div>
    <Image className=" max-h-80 object-cover w-screen" width={1500} height={200}
      src={header_image}
    />
  </div>
}

export default Header;
