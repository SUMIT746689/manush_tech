import Image from 'next/image';
import React from 'react';
const গ্যালারী = [
    {
        url: 'slider-1.jpg'
    }
]
const page = () => {
    return (
        <div className=' grid px-20 mt-4'>

            <div >
                <hr class="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
                <h3 className=' h-6 text-center pt-1 font-bold'>
                    গ্যালারী
                </h3>

                <hr class="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
            </div>
            <div className='grid gap-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 place-content-center'>
                {
                    গ্যালারী.map(i =>
                        <div className='p-2 shadow-md'>
                            <Image
                                height={500}
                                width={500}
                                quality={100}
                                className="w-full object-cover h-full"
                                src={`/${i.url}`}
                                loading="lazy"
                                alt={""}
                            />
                            {/* <Image
                                width={200}
                                height={300}
                                className="w-full object-cover h-full"
                                src={i.url}
                                loading="lazy"
                                quality={100}
                                alt={""}
                            /> */}
                        </div>
                    )
                }
            </div>

        </div>
    );
};

export default page;