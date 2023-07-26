'use client';
import Link from 'next/link';
import { useState } from 'react';

const navLink = 'px-4 py-3 h-full hover:cursor-pointer hover:bg-sky-900 duration-150 ';

const primaryBgColor = 'bg-sky-700';
const primaryColor = 'text-sky-100';
const whiteColor = 'text-sky-100';
const secondaryColor = 'text-sky-700';

const classList = [
  {
    name: "EB - One",
    id: 1
  },
  {
    name: "EB Two",
    id: 2
  },
  {
    name: "EB Three",
    id: 3
  },
  {
    name: "EB Four",
    id: 4
  },
  {
    name: "EB Five",
    id: 5
  },
  {
    name: "Six",
    id: 6
  },
  {
    name: "Seven",
    id: 7
  },
  {
    name: "Eight",
    id: 8
  },
  {
    name: "Nine",
    id: 9
  },
  {
    name: "Ten",
    id: 10
  },
  {
    name: "Alim 1st",
    id: 11
  },
  {
    name: "Alim  2nd",
    id: 12
  },
  {
    name: "Fazil 1st",
    id: 13
  },
  {
    name: "Fazil 2nd",
    id: 14
  },
  {
    name: "Fazil 3rd",
    id: 15
  },
  {
    name: "Kamil 1st",
    id: 16
  },
  {
    name: "Kamil 2nd",
    id: 17
  },
  {
    name: "Play",
    id: 18
  }, {
    name: "One",
    id: 19
  },
]

const NavLinks = ({serverhost}) => {
  return (
    <>
      <Link href="/">
        <div className={navLink}>প্রধান পাতা</div>
      </Link>
      <Link href="/teachers">
        <div className={navLink}> শিক্ষক</div>
      </Link>
      <Link href="/suborna-joyonti">
        <div className={navLink}> সুবর্ণজয়ন্তী কর্ণার</div>
      </Link>
      <Link href="/gallery">
        <div className={navLink}> গ্যালারী</div>
      </Link>

      <div className={navLink}> পরিক্ষা সংক্রান্ত</div>

      <Link href='/text-book'>
        <div className={navLink}> পাঠ্যপুস্তক</div>
      </Link>

      {/* <Link href='/student-information'><div className={navLink}> শিক্ষার্থীদের তথ্য </div></Link> */}
      <div className="relative group">
        <div className={navLink} >
          <span>শিক্ষার্থীদের তথ্য</span>
        </div>
        <div className="absolute z-10 hidden bg-grey-200 group-hover:block">

          <div className={`px-2 pt-2 pb-4 ${primaryBgColor} ${primaryColor} shadow-lg rounded-b-lg`}>
            <div className={`flex flex-col h-80 w-full overflow-y-scroll  scrollbar `}>
              {
                classList.map(i =>
                  <Link className=' w-32 hover:cursor-pointer hover:bg-sky-800 duration-150' href={`/student-information/${i.id}`}><div className={navLink}>{i.name} </div></Link>
                )
              }


            </div>
          </div>
        </div>
      </div>
      <div className={navLink}> ডিজিটাল হাজিরা </div>
      <Link href="/notice">
        <div className={navLink}> নোটিশ</div>
      </Link>
      <Link href={`${serverhost}`}>
         <div className={navLink}>
        লগইন
      </div>
      </Link>
     
    </>
  );
};

function Nav({serverhost}) {

  return (
    <>
      <nav
        className={`${primaryBgColor} ${primaryColor} hidden lg:grid text-sm grid-flow-col divide-x`}
      >
        <NavLinks serverhost={serverhost} />
      </nav>

    </>
  );
}

export default Nav;
