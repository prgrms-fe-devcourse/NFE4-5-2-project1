import tb_w_logo from "../assets/images/tb_w_logo.svg";

import { logos } from "../utils/getLogoImages";
import { Link, useLocation } from "react-router";
import HeaderIcon from "../components/Header/HeaderIcon";
import { useEffect, useState } from "react";
import { getChannel } from "../api/posts";

const liItemStyle = "justify-center cursor-pointer whitespace-nowrap";
const liImgStyle = "mr-1 h-7 w-7 lg:mr-2";

type Channel = {
  _id: string;
  name: string;
};

export default function Header() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const data = await getChannel();
        setChannels(data);
      } catch (err) {
        console.error("채널 불러오기 실패", err);
      }
    };

    fetchChannels();
  }, []);

  return (
    <header>
      <div className="z-70 fixed bg-[#0033A0] w-full h-[80px] dark:bg-[#16171B]">
        <div className="flex justify-between">
          <Link to="/">
            <img
              src={tb_w_logo}
              alt="PC버전 로고"
              className="md:w-60 md:h-12 md:ml-[120px] sm:ml-0 mt-5 md:mt-4 sm:w-50 h-9 ml-6 cursor-pointer hiddenHeader"
            />
          </Link>
          <HeaderIcon />
        </div>
      </div>
      <div className="fixed z-60 w-full bg-[#f5f5f5] h-[80px] md:h-[70px] top-[80px] border-b border-gray-200 dark:border-0 hiddenHeader dark:bg-[#202228] dark:text-white">
        <ul
          className="grid grid-cols-5 md:grid-cols-10 xl:gap-[1%] md:px-[8%] px-[2%] md:mt-5 mt-3 
        "
        >
          {channels.map((channel) => {
            const logoList = logos.find((logo) => logo.name === channel.name);
            return (
              <li key={channel._id} className={liItemStyle}>
                <Link
                  to={`/fanpage/${channel.name}/${channel._id}`}
                  onClick={() => window.scrollTo(0, 0)}
                  className={`flex items-center justify-center hover:text-[#ff9500] hover:underline hover:underline-offset-7 hover:decoration-2 ${
                    location.pathname.includes(channel._id)
                      ? "text-[#ff9500] underline underline-offset-7 decoration-2 font-bold"
                      : ""
                  }`}
                >
                  {logoList && <img src={logoList.logo} className={liImgStyle} alt={channel._id} />}
                  <p className="md:text-lg sm:text-sm">{channel.name}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
