import { ReactNode, useEffect, useMemo, useState } from "react";
import SearchBar from "../../../components/common/SearchBar";
import { Plus } from "lucide-react";
import { Post } from "../types/Post";
import usePostsByChannel from "../../../hooks/usePostsByChannel";
import Pagination from "../../../components/common/Pagination";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import NoneBorderSelectBox from "../../../components/common/NoneBorderSelectBox";
import { useNavigate, useSearchParams } from "react-router";

interface ComunityPageProps {
  renderTable: (posts: Post[]) => ReactNode;
  channelId: string;
}

export default function CommunityPage({
  renderTable,
  channelId,
}: ComunityPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [searchInput, setSearchInput] = useState("");
  const [searchType, setSearchType] = useState<"all" | "title" | "writer">(
    "all"
  );
  const navigate = useNavigate();
  const [cntPage, setCntPage] = useState(10);
  const { posts, loading } = usePostsByChannel(channelId);
  const searchOptions = [
    { value: "all", label: "전체" },
    { value: "title", label: "게시물" },
    { value: "writer", label: "사용자" },
  ];

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter((post) => {
      if (!searchInput.trim()) return true;
      return searchType === "all"
        ? post.title.includes(searchInput) ||
            post.author.fullName.includes(searchInput)
        : searchType === "title"
        ? post.title.includes(searchInput)
        : post.author.fullName.includes(searchInput);
    });
  }, [posts, searchInput, searchType]);

  useEffect(() => {
    if (searchInput.trim() !== "" || searchType !== "all") {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", "1");
        return newParams;
      });
    }
  }, [searchInput, searchType, setSearchParams]);

  const setPagination = (newCntPage: number) => {
    if (newCntPage !== cntPage) {
      setCntPage(newCntPage);

      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", "1");
        return newParams;
      });
    }
  };

  const indexOfLastPost = currentPage * cntPage;
  const indexOfFirstPost = indexOfLastPost - cntPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  if (loading)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <>
      <div className="mb-24">
        <div className="flex w-full py-12 justify-between items-center text-[color:var(--white-80)]">
          <div className="w-auto flex gap-4 items-center">
            <div className="w-[94px]">
              <NoneBorderSelectBox
                options={searchOptions}
                value={
                  searchOptions.find((opt) => opt.value === searchType) ?? null
                }
                onChange={(selected) =>
                  setSearchType(selected.value as "all" | "title" | "writer")
                }
              />
            </div>

            <SearchBar
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              className="w-[200px]"
            />
          </div>

          <Plus
            className="cursor-pointer mr-1"
            onClick={() => navigate("add")}
          />
        </div>

        {renderTable(currentPosts)}

        <div className="mt-8 flex justify-center">
          <Pagination
            cntPage={cntPage}
            totalCnt={filteredPosts.length}
            setPagination={setPagination}
          />
        </div>
      </div>
    </>
  );
}
