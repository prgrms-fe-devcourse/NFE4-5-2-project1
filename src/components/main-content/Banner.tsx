import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import banner1 from '../../assets/images/main-banner/banner1.svg';
import banner2 from '../../assets/images/main-banner/banner2.svg';
import banner3 from '../../assets/images/main-banner/banner3.svg';
import stop from '../../assets/images/main-banner/icons-stop.svg';
import play from '../../assets/images/main-banner/icons-play.svg';

import { Autoplay, Navigation, Pagination, A11y } from 'swiper/modules';
import { useRef, useState } from 'react';

import type { Swiper as SwiperType } from 'swiper';

export default function Banner() {
  const [auto, setAuto] = useState(true);
  const swiperRef = useRef<SwiperType | null>(null);

  const autoPlayHandler = () => {
    if (auto) {
      swiperRef.current?.autoplay.stop();
    } else {
      swiperRef.current?.autoplay.start();
    }
    setAuto(!auto);
  };

  return (
    <>
      <div className='w-full h-[355px] relative overflow-hidden rounded-[10px] bg-white mb-[30px] shadow-md'>
        <Swiper
          className='!w-full !h-full'
          modules={[Autoplay, Navigation, Pagination, A11y]}
          loop={true}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 4500 }}
          speed={1700}
          pagination={{
            clickable: true,
            el: '.custom-pagination',
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          <SwiperSlide>
            <img
              src={banner1}
              alt='메인 배너 1'
              className='min-w-full min-h-full max-w-none'
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={banner2}
              alt='메인 배너 2'
              className='min-w-full min-h-full max-w-none'
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={banner3}
              alt='메인 배너 2'
              className='min-w-full min-h-full max-w-none'
            />
          </SwiperSlide>
        </Swiper>
        <div className='swiper-remote'>
          <div className='custom-pagination'></div>
          <button
            className='ml-[7px] cursor-pointer'
            onClick={autoPlayHandler}
            aria-label={auto ? '멈춤' : '재생'}
          >
            <img
              className='h-[15px]'
              src={auto ? stop : play}
              alt={stop ? '멈춤' : '재생'}
            ></img>
          </button>
        </div>
      </div>
    </>
  );
}
