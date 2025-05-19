import Pagination from "../components/common/Pagination";
import ConcertBanner from "../features/upcoming_concerts/components/ConcertBanner";
import ConcertList from "../features/upcoming_concerts/components/ConcertList";
import ConcertListSkeleton from "../features/upcoming_concerts/components/ConcertListSkeleton";
import useConcerts from "../features/upcoming_concerts/hooks/useConcerts";
import { usePaginatedConcerts } from "../features/upcoming_concerts/hooks/usePaginatedConcerts";

export default function UpcomingConcerts() {
  const channelId = "681728150949dd30548aa760";
  const { concerts, loading } = useConcerts(channelId);
  const { currentConcerts, cntPage, setPagination } =
    usePaginatedConcerts(concerts);

  return (
    <div className="grid justify-center items-center w-[80%] lg:w-[800px] xl:w-[1080px] pb-20">
      <ConcertBanner />
      <div className="mt-8">
        {loading ? (
          <ConcertListSkeleton />
        ) : (
          <>
            <ConcertList concerts={currentConcerts} />
            {concerts && concerts.length > 0 && (
              <div className="mt-20 flex justify-center">
                <Pagination
                  cntPage={cntPage}
                  totalCnt={concerts.length}
                  setPagination={setPagination}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
