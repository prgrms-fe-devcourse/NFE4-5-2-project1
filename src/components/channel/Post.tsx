import { useState } from 'react';
import profile from '../../assets/images/profile.svg';
import bedIcon from '../../assets/icons/bedIcon.svg';
import ImageSlider from './ImageSlider';
import PostInteraction from './PostInteraction';
import PostComments from './PostComments';

interface PostProps {
  post: {
    likes: likesObj[];
    comments: any[];
    _id: string;
    title: string;
    image: string;
    createdAt: string;
    author: {
      _id: string;
      fullName: string;
      image: string;
    };
  };
}
interface likesObj {
  _id: string;
  user: string;
  post: string;
  createdAt: string;
}

interface ParsedTitle {
  uploadedImages: string[];
  writtenTitle: string;
  tags: string[];
  locations: string[];
  hotels: string[];
  cost: string;
  context: string;
  author?: any[];
}

export default function Post({ post }: PostProps) {
  const parsedTitle = JSON.parse(post.title) as ParsedTitle;
  const [showBox, setShowBox] = useState(false);
  const toggleCommentBox = () => setShowBox((prev) => !prev);
  // console.log('parsedTitle: ', parsedTitle);

  // 이미지 배열 추출
  const imageUrls: string[] = parsedTitle.uploadedImages ?? [];

  return (
    <div className="border border-[var(--color-border)] p-4 rounded-lg shadow-sm bg-[var(--color-post-bg)] max-w-[600px] h-100% px-[30px]  mb-[30px]">
      <div className="flex justify-between mb-[10px]">
        <div className="flex items-center gap-0.2">
          <img
            src={post.author.image || profile}
            alt="user"
            className="w-[40px] h-[40px] mr-[10px] rounded-3xl"
          />
          <div className="font-bold text-[18px] text-[var(--color-post-text)]">
            {parsedTitle.author || post.author.fullName}
          </div>
        </div>
        <div className="flex gap-3 h-[40px]">
          {parsedTitle.tags?.map((tag: string, idx: number) => (
            <div
              key={idx}
              className="bg-[#2A728C] text-white px-3 py-1 h-[25px] rounded-xl text-[13px] flex items-center"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      {/* 이미지 슬라이더 삽입 */}
      {imageUrls.length > 0 && (
        <div className="flex justify-center mb-[10px]">
          <ImageSlider images={imageUrls} alt={parsedTitle.writtenTitle} />
        </div>
      )}

      <div className="flex flex-row gap-2">
        <div className="w-[600px]">
          {/* 제목, 날짜 */}
          <div className="flex justify-between items-center relative ">
            <h2 className="text-[30px] font-bold text-[var(--color-title)] mb-[20px]  ">
              {parsedTitle.writtenTitle}
            </h2>
            <div className="flex justify-end text-[var(--color-subText)] text-[13px] absolute right-0 top-[50px]">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* 장소, 비용 */}
          <div
            className="flex gap-3 text-[var(--color-subText)] 
          mb-[10px] w-[100%] py-[5px]"
            // border-b-2 border-[var(--color-lightGray)]
          >
            <div className="flex gap-3 text-[15px]">
              {parsedTitle.locations?.map((loc: string, idx: number) => (
                <p key={idx}>{loc}</p>
              ))}
            </div>
            <div className="ml-auto text-[12px]">
              총 비용: {parsedTitle.cost} ₩
            </div>
          </div>

          {/* 숙소 */}
          {parsedTitle.hotels?.map((hotel: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <img src={bedIcon} alt="bed" className="mb-auto" />
              <div className="mb-[10px] text-[var(--color-subText)] text-[15px]">
                {hotel}
              </div>
            </div>
          ))}

          {/* 본문 */}
          <div className="min-h-[130px] overflow-auto border-t-2 border-[var(--color-border)] py-3">
            <p className="text-[15px] text-[var(--color-post-text)] whitespace-pre-line">
              {parsedTitle.context}
            </p>
          </div>
        </div>
      </div>

      {/* 좋아요 & 댓글 */}
      <div className="w-100% border-[var(--color-black)] flex flex-col">
        <PostInteraction
          postId={post._id}
          postAuthorId={post.author._id}
          likes={post.likes}
          comments={post.comments}
        />
        {!showBox && (
          <div
            className="text-[var(--color-commentBox-open)] cursor-pointer underline py-0.5 ml-[4px]"
            onClick={toggleCommentBox}
          >
            발자국 {post.comments.length}개 모두보기...
          </div>
        )}
        {showBox && <PostComments postId={post._id} comments={post.comments} />}
      </div>
    </div>
  );
}
