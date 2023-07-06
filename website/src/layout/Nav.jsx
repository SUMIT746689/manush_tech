'use client';
import Link from 'next/link';
import { useState } from 'react';

const navLink =
  'px-4 py-3 h-full hover:cursor-pointer hover:bg-sky-900 duration-150 ';

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

const NavLinks = () => {
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



      {/* <button id="dropdownHoverButton" data-dropdown-toggle="dropdownHover" data-dropdown-trigger="hover" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">পরিক্ষা সংক্রান্ত <svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button> */}
      {/* Dropdown menu  */}
      {/* <div id="dropdownHover" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
          </li>
        </ul>
      </div> */}


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

          <div className={`px-2 pt-2 pb-4 ${primaryBgColor} ${primaryColor} shadow-lg`}>
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

      <div className={navLink}> লগইন</div>
    </>
  );
};

function Nav() {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <>
      <nav
        className={`${primaryBgColor} ${primaryColor} hidden lg:grid text-sm grid-flow-col divide-x`}
      >
        <NavLinks />
      </nav>

      <nav className=" lg:hidden bg-sky-700 border-gray-200 ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/" className="flex items-center">
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              Mehedi School
            </span>
          </Link>
          <button
            data-collapse-toggle="navbar-multi-level"
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-100 rounded-lg hover:focus:outline-none focus:ring-2 focus:ring-gray-200 "
            aria-controls="navbar-multi-level"
            aria-expanded="false"
            onClick={() => setOpenDropdown((value) => !value)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div
            className={`${openDropdown ? 'h-[500px]' : 'h-[0px]'
              } w-full lg:w-auto duration-500 transition-all"`}
          >
            <ul
              className="py-2 text-sm text-gray-100"
              aria-labelledby="dropdownLargeButton"
            >
              <NavLinks />
            </ul>
            {/* <div className="py-1">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                    >
                      Sign out
                    </a>
                  </div> */}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Nav;
