import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Concert } from "../types/Concert";

export function usePaginatedConcerts(concerts: Concert[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [cntPage, setCntPage] = useState(16);

  const currentConcerts = useMemo(() => {
    if (!concerts || concerts.length === 0) return [];
    const indexOfLastConcert = currentPage * cntPage;
    const indexOfFirstConcert = indexOfLastConcert - cntPage;
    return concerts.slice(indexOfFirstConcert, indexOfLastConcert);
  }, [concerts, currentPage, cntPage]);

  const setPagination = (newCntPage: number) => {
    if (newCntPage !== cntPage) {
      setCntPage(newCntPage);

      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", "1");
      setSearchParams(newParams);
    }
  };

  return {
    currentConcerts,
    currentPage,
    cntPage,
    setPagination,
  };
}
