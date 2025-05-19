import { Concert } from "../types/Concert";

export default function ConcertCard({ data }: { data: Concert }) {
  const {
    image,
    title: { title, artist, date, place, url },
  } = data;

  return (
    <a href={url} target="_blank">
      <div className="nav-underline w-[140px] h-[285px] border-[var(--white)] md:w-[240px] md:h-[480px]">
        <img src={image} className="w-[140px] h-[175px] md:w-80 md:h-[300px]" />
        <div className="mt-2 md:mt-10 md:mb-4">
          <p className="h-[30px] overflow-hidden w-[140px] md:w-[240px] md:truncate text-xs md:text-xl text-[var(--primary-300)] font-bold mb-2">
            {title}
          </p>
          <p className="text-xs md:text-lg font-medium mb-1">{artist}</p>
          <p className="text-[8px] md:text-sm mb-2 text-[color:var(--grey-100)]">
            {date}
          </p>
        </div>
        <p className="text-[8px] md:text-xs text-[color:var(--white-80)]">
          in {place}
        </p>
      </div>
    </a>
  );
}
