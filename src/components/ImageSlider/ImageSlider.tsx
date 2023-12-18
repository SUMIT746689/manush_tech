import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Link from 'next/link';


function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className}  text-2xl  `}
            style={{ ...style, display: "relative", left: "10px", zIndex: "50" }}
            onClick={onClick}
        />
    );
}

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "relative", right: "10px", zIndex: "50" }}
            onClick={onClick}
        />
    );
}


const ImageSlider = ({ images, target = '' }: { images: { url: string, redirectUrl?: string }[], target: '_blank' | '' }) => {
    const settings = {
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        autoplay: true,
        autoplaySpeed: 5000,
        prevArrow: <SamplePrevArrow />,
        nextArrow: <SampleNextArrow />,
        // responsive: [
        //   // {
        //   //   breakpoint: 1024,
        //   //   settings: {
        //   //     slidesToShow: 3,
        //   //     slidesToScroll: 3,
        //   //     infinite: true,
        //   //     dots: true
        //   //   }
        //   // },
        //   // {
        //   //   breakpoint: 600,
        //   //   settings: {
        //   //     slidesToShow: 2,
        //   //     slidesToScroll: 2,
        //   //     initialSlide: 2
        //   //   }
        //   // },
        //   {
        //     breakpoint: 480,
        //     settings: {
        //       slidesToShow: 1,
        //       slidesToScroll: 1
        //     }
        //   }
        // ]
    };

    return (
        <>
            <Slider {...settings}>
                {
                    images?.map((image, index) =>
                        image?.redirectUrl ?
                            < Link target={target} href={image?.redirectUrl} key={index} >
                                <img className=" max-h-96 object-fill w-screen" src={`/api/get_file/${image?.url}`} />
                            </Link>
                            :
                            <img className=" max-h-96 object-fill w-screen" src={`/api/get_file/${image?.url}`} />
                    )
                }
            </Slider >
        </>
    )
};

export default ImageSlider;
