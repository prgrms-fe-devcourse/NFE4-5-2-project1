import { useCallback, useEffect, useMemo, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useSearchParams } from "react-router";

interface PaginationProps {
  cntPage: number;
  totalCnt: number;
  setPagination?: (cntPage: number, totalCnt: number, page: number) => void;
}

export default function Pagination({
  cntPage,
  totalCnt,
  setPagination,
}: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [pageState, setPageState] = useState<number>(1);
  const maxPage = Math.max(1, Math.ceil(totalCnt / cntPage));

  useEffect(() => {
    if (setPagination) setPagination(cntPage, totalCnt, currentPage);

    const newPageState = Math.floor((currentPage - 1) / 5) * 5 + 1;
    setPageState(newPageState);
  }, [currentPage, cntPage, totalCnt, setPagination]);

  const pageNumberList = useMemo(() => {
    const pageNumbers = [];
    for (let i = pageState; i < pageState + 5 && i <= maxPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }, [pageState, maxPage]);

  const selectPageNum = useCallback(
    (value: number) => {
      if (value === currentPage) return;

      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", value.toString());
        return newParams;
      });
    },
    [currentPage, setSearchParams]
  );

  const goToJumpPage = useCallback(
    (move: "prev" | "next") => {
      let newPage;

      if (maxPage <= 5) {
        newPage = move === "next" ? maxPage : 1;
      } else {
        newPage =
          move === "next"
            ? Math.min(currentPage + 5, maxPage)
            : Math.max(currentPage - 5, 1);
      }

      if (newPage === currentPage) return;

      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", newPage.toString());
        return newParams;
      });
    },
    [currentPage, maxPage, setSearchParams]
  );

  return (
    <div className="flex items-center gap-3">
      <button disabled={currentPage === 1} onClick={() => goToJumpPage("prev")}>
        <Pause className="cursor-pointer" fill="var(--red)" strokeWidth={0} />
      </button>

      {pageNumberList.map((value) => (
        <button
          key={value}
          className={`px-2 py-1 cursor-pointer ${
            value === currentPage ? "text-[color:var(--primary-300)]" : ""
          }`}
          onClick={() => selectPageNum(value)}
          disabled={value === currentPage}
        >
          {value}
        </button>
      ))}
      <button
        disabled={currentPage === maxPage}
        onClick={() => goToJumpPage("next")}
      >
        <Play
          className="cursor-pointer"
          fill="var(--primary-300)"
          strokeWidth={0}
        />
      </button>
    </div>
  );
}
