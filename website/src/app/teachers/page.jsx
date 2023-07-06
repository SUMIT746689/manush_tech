import Image from 'next/image'
import React from 'react'


async function getData() {
  try {
    const res = await fetch('http://localhost:3001/api/teacher', { next: { revalidate: 0 } });
    console.log({ res })
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return await res.json();

  }
  catch (err) {
    console.log(err);
    return []
  }
}
async function page() {
  const data = await getData();
  console.log("data__", data);
  const content = [
    {
      id: 1,
      imgUrl: 'teacher_1.jpg',
      title: 'A SALEH MD SADEK HOSSAIN',
      designation: 'Kamil'
    },
    {
      id: 2,
      imgUrl: 'teacher_2.jpg',
      title: 'MD GOLAM MOSTAFA (Ap)',
      designation: 'Kamil'
    },
    {
      id: 3,
      imgUrl: 'teacher_3.jpg',
      title: 'MD MONIRUZZAMAN',
      designation: 'MA'
    },
    {
      id: 4,
      imgUrl: 'teacher_4.jpg',
      title: 'MD FAIZULLAH SIDDIQUE',
      designation: 'Kamil'
    },
    // {
    //   id: 5,
    //   imgUrl: 'teacher_1.jpg',
    //   title: 'A SALEH MD SADEK HOSSAIN',
    //   designation: 'Kamil'
    // },
    // {
    //   id: 6,
    //   imgUrl: 'teacher_3.jpg',
    //   title: 'MD MONIRUZZAMAN',
    //   designation: 'MA'
    // },
    // {
    //   id: 7,
    //   imgUrl: 'teacher_2.jpg',
    //   title: 'MD GOLAM MOSTAFA (Ap)',
    //   designation: 'Kamil'
    // },
    // {
    //   id: 8,
    //   imgUrl: 'teacher_3.jpg',
    //   title: 'MD MONIRUZZAMAN',
    //   designation: 'MA'
    // },
    // {
    //   id: 9,
    //   imgUrl: 'teacher_4.jpg',
    //   title: 'MD FAIZULLAH SIDDIQUE',
    //   designation: 'Kamil'
    // },

  ]
  return (
    <div className=' container mx-auto'>

      <div className="grid grid-cols-1 gap-3 justify-center pt-6 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 ">

        {
          data?.map(i => (
            <div key={i.id} className="shadow-md p-4 flex justify-between flex-col">

              {/* <Image
                height={500}
                width={500}
                quality={100}
                className="w-full object-cover h-full"
                src={i.photo ? `http://localhost:3001/files/${i.photo}` : '/dummy.jpg'}
                loading="lazy"
                alt={""}
              /> */}

              <div className='grid place-content-center text-center bg-violet-200 p-2'>
                <h2 className='font-bold'>{i.first_name}
                </h2>
                {/* <h3>{i.designation}</h3> */}
              </div>
            </div>
          ))
        }


      </div>


    </div>
  )
}

export default page