import { useEffect, useState } from 'react';
import profile from '../assets/images/profile.svg';
import bedIcon from '../assets/icons/bedIcon.svg';
import plus from '../assets/icons/plus.svg';
import pin from '../assets/icons/pin.svg';
import ImageSlider from './channel/ImageSlider';
import PostInteraction from './channel/PostInteraction';
import PostComments from './channel/PostComments';
import { axiosInstance } from '../api/axios';
import { toast } from 'react-toastify';
import { cloudinaryAxiosInstance } from '../api/cloudinaryAxios';

interface likesObj {
  _id: string;
  user: string;
  post: string;
  createdAt: string;
}

interface PostType {
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
  channel: string;
  updatedAt: string;
}
interface likesObj {
  _id: string;
  user: string;
  post: string;
  createdAt: string;
}

interface PostModalProps {
  isMyProfile?: boolean;
  post: PostType | null;
  onClose: () => void;
  onSaved?: (updatedPost: PostType) => void;
  user: { _id: string; fullName: string; image: string };
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

interface UploadedImage {
  url: string;
  publicId: string;
}

export default function PostModal({
  post,
  onClose,
  user,
  onSaved,
  isMyProfile,
}: PostModalProps) {
  if (!post) return null;

  const parsedTitle = JSON.parse(post.title) as ParsedTitle;
  const imageUrls: string[] = parsedTitle.uploadedImages ?? [];

  const [showBox, setShowBox] = useState(false);
  const toggleCommentBox = () => setShowBox((prev) => !prev);
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu((prev) => !prev);
  const [isEditing, setIsEditing] = useState(false);
  const [editableTitle, setEditableTitle] = useState(parsedTitle);
  const [locationsInput, setLocationsInput] = useState(
    editableTitle.locations?.join(', ') || ''
  );
  const [hotelsInput, setHotelsInput] = useState(
    editableTitle.hotels?.join(', ') || ''
  );
  const [tagsInput, setTagsInput] = useState(
    editableTitle.tags?.join(', ') || ''
  );

  // 이미지 부분
  const [images, setImages] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      handleCloudinaryUpload(fileArray);
    }
  };

  // 이미지 올리기
  const handleCloudinaryUpload = async (files: File[]) => {
    const uploadPromises = files.map((file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'programmersProject2');

      return cloudinaryAxiosInstance
        .post('', formData)
        .then((res) => ({
          url: res.data.secure_url,
          publicId: res.data.public_id,
        }))
        .catch((error) => {
          console.error('Cloudinary 업로드 실패:', error);
          return null;
        });
    });

    const uploaded = await Promise.all(uploadPromises);
    const successful = uploaded.filter(
      (item): item is UploadedImage => item !== null
    );

    setUploadedImages((prev) => [...prev, ...successful]);
    setImages((prev) => [...prev, ...successful.map((img) => img.url)]);
  };

  const handleImgDelete = (index: number) => {
    if (images.length <= 1) {
      toast.warning('이미지는 최소 한 장 필요합니다.');
      return;
    }
    if (index === 0) {
      toast.warning('첫 번째 이미지는 삭제할 수 없습니다.');
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (post?.title) {
      try {
        const parsed = JSON.parse(post.title) as ParsedTitle;
        setImages(parsed.uploadedImages ?? []);
        setUploadedImages(
          (parsed.uploadedImages ?? []).map((url) => ({ url, publicId: '' }))
        );
      } catch (e) {
        console.error('이미지 파싱 실패', e);
      }
    }
  }, [post]);

  const handleSave = async () => {
    if (images.length === 0) {
      toast.warning('이미지는 최소 한 장 필요합니다.');
      return;
    }

    const updatedTitle: ParsedTitle = {
      ...editableTitle,
      uploadedImages: uploadedImages.map((img) => img.url),
      tags: tagsInput.split(',').map((s) => s.trim()),
      locations: locationsInput.split(',').map((s) => s.trim()),
      hotels: hotelsInput.split(',').map((s) => s.trim()),
    };

    const mainImageUrl = images[0];
    const mainUploaded = uploadedImages.find((img) => img.url === mainImageUrl);

    const payload = {
      postId: post._id,
      title: JSON.stringify(updatedTitle),
      image: mainUploaded?.url || '',
      channelId: post.channel,
    };

    try {
      await axiosInstance.put(`/posts/update`, payload);
      toast('게시글이 수정되었습니다.');
      setIsEditing(false);
      onClose();
      if (onSaved) {
        onSaved({ ...post, title: payload.title, image: payload.image });
      }
    } catch (err) {
      console.error(err);
      toast.error('수정 실패');
    }
  };

  // 게시글 삭제
  const handleDelete = async () => {
    try {
      await axiosInstance.delete('/posts/delete', {
        data: { id: post._id },
      });
      toast('게시글이 삭제되었습니다.');
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('삭제 실패:', error);
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center pl-60 z-50">
      <div className="bg-white rounded-lg p-10 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-5 text-[var(--color-darkGray)] text-3xl font-bold cursor-pointer"
        >
          ×
        </button>

        {/* 내 게시글일때만 */}
        {isMyProfile && !isEditing && (
          <div className="absolute top-1 right-15">
            <button
              onClick={toggleMenu}
              className="text-[var(--color-darkGray)] text-3xl font-bold cursor-pointer"
            >
              ...
            </button>

            {/* ... 버튼 눌럿을때 */}
            {showMenu && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md z-50 w-[120px]">
                <button
                  className="w-full px-4 py-2 hover:bg-gray-100 text-left text-sm cursor-pointer"
                  onClick={() => {
                    setShowMenu(false);
                    setIsEditing(true);
                    setEditableTitle(parsedTitle);
                  }}
                >
                  수정하기
                </button>
                <button
                  className="w-full px-4 py-2 hover:bg-gray-100 text-left text-sm cursor-pointer"
                  onClick={() => {
                    setShowMenu(false);
                    handleDelete();
                  }}
                >
                  삭제하기
                </button>
              </div>
            )}
          </div>
        )}

        <div className="p-4 rounded-lg bg-white w-[50vw] px-[30px] mb-[30px]">
          <div className="flex justify-between mb-[10px]">
            <div className="flex items-center gap-0.2">
              <img
                src={user.image || profile}
                alt="user"
                className="w-[40px] h-[40px] rounded-full mr-3"
              />
              <div className="font-bold text-[18px]">{user.fullName}</div>
            </div>

            {/* 태그 수정부분 */}
            <div className="flex gap-3 h-[40px]">
              {isEditing ? (
                <div className="flex items-center gap-2 w-full">
                  <span className="w-[40px] text-center text-[14px]">태그</span>
                  <input
                    className="w-full min-h-[20px] border rounded p-2 text-[15px]"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />
                </div>
              ) : (
                parsedTitle.tags?.map((tag: string, idx: number) => (
                  <div
                    key={idx}
                    className="bg-[#2A728C] text-white px-3 py-1 h-[25px] rounded-xl text-[13px] flex items-center"
                  >
                    {tag}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 이미지 수정부분 */}
          {isEditing && (
            <div className="flex flex-wrap gap-2 mb-10 mt-10">
              {/* 이미지 띄우기 */}
              {images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img}
                    alt={`preview-${idx}`}
                    className="w-32 h-32 object-cover rounded-xs"
                  />
                  <button
                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full cursor-pointer"
                    onClick={() => handleImgDelete(idx)}
                  >
                    X
                  </button>
                </div>
              ))}
              <label
                htmlFor="file"
                className="w-32 h-32 flex justify-center items-center rounded-xs cursor-pointer bg-[var(--color-image-bg)] group"
              >
                <div className="flex flex-col justify-center items-center">
                  <div>사진 추가하기</div>
                  <img
                    src={plus}
                    alt="plus icon"
                    className="w-[20px] h-[20px] transition-transform duration-200 group-hover:scale-125"
                  />
                </div>
              </label>
              <input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* 수정 상태 아닐때 이미지 띄우기 */}
          {imageUrls.length > 0 && !isEditing && (
            <div className="flex justify-center mb-[10px]">
              <ImageSlider images={imageUrls} alt={parsedTitle.writtenTitle} />
            </div>
          )}

          {/* 제목 수정부분 */}
          <div className="flex flex-row gap-2">
            <div className="w-[50vw]">
              <div className="flex justify-between items-center">
                {isEditing ? (
                  <div className="flex items-center gap-3 w-full">
                    <span className="w-[40px] text-center text-[17px]">
                      제목
                    </span>
                    <input
                      className="text-[28px] font-bold p-2 text-[var(--color-title)] mb-[10px] w-full border rounded"
                      value={editableTitle.writtenTitle}
                      onChange={(e) =>
                        setEditableTitle({
                          ...editableTitle,
                          writtenTitle: e.target.value,
                        })
                      }
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-[30px] font-bold text-[var(--color-title)] mb-[20px]">
                      {parsedTitle.writtenTitle}
                    </h2>
                    <div className="flex justify-end text-[var(--color-subText)]">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </>
                )}
              </div>

              {/* 위치 수정 (,로 구분) */}
              <div className="flex gap-3 mb-[10px] w-[100%] py-[5px]">
                {isEditing ? (
                  <div className="flex items-center gap-2 w-full ">
                    <img src={pin} className="h-7" />
                    <span className="w-[40px] text-center text-[14px]">
                      위치
                    </span>
                    <input
                      className="w-full min-h-[50px] border rounded p-2 text-[15px]"
                      value={locationsInput}
                      onChange={(e) => setLocationsInput(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="flex gap-3 text-[15px]">
                    {parsedTitle.locations?.map((loc: string, idx: number) => (
                      <p key={idx}>{loc}</p>
                    ))}
                  </div>
                )}

                {/* 비용 수정부분 */}
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <span className="w-[40px] text-center text-[14px]">
                      비용
                    </span>
                    <input
                      className="w-[90px] h-[50px] border rounded p-1 text-[13px] text-right"
                      type="number"
                      value={editableTitle.cost}
                      onChange={(e) =>
                        setEditableTitle({
                          ...editableTitle,
                          cost: e.target.value,
                        })
                      }
                    />
                  </div>
                ) : (
                  <div className="ml-auto text-[12px]">
                    총 비용: {parsedTitle.cost}
                  </div>
                )}
              </div>

              {/* 숙소 수정부분(,로 구분) */}
              <div className="flex gap-3 text-[15px]">
                {isEditing ? (
                  <div className="flex items-center gap-2 w-full">
                    <img src={bedIcon} className="h-7" />
                    <span className="w-[40px] text-center text-[14px]">
                      숙소
                    </span>
                    <input
                      className="w-full min-h-[50px] border rounded p-2 text-[15px]"
                      value={hotelsInput}
                      onChange={(e) => setHotelsInput(e.target.value)}
                    />
                  </div>
                ) : (
                  parsedTitle.hotels?.map((hotel: string, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <img src={bedIcon} alt="bed" className="mb-auto" />
                      <div className="mb-[10px] text-[var(--color-subText)] text-[15px]">
                        {hotel}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* 내용 수정부분 */}
              <div className="min-h-[130px] my-4 overflow-auto border-t-2 border-[var(--color-lightGray)] py-3">
                {isEditing ? (
                  <textarea
                    className="w-full h-[200px] border rounded p-2 text-[15px]"
                    value={editableTitle.context}
                    onChange={(e) =>
                      setEditableTitle({
                        ...editableTitle,
                        context: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="text-[15px] whitespace-pre-line">
                    {parsedTitle.context}
                  </p>
                )}
              </div>
            </div>
          </div>

          {isEditing ? (
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
              >
                저장
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditableTitle(parsedTitle);
                }}
                className="bg-gray-300 text-black px-4 py-2 rounded cursor-pointer"
              >
                취소
              </button>
            </div>
          ) : (
            <div className="w-100% border-[var(--color-black)] flex flex-col">
              <PostInteraction
                postId={post._id}
                postAuthorId={post.author._id}
                likes={post.likes}
                comments={post.comments}
              />

              {!showBox && (
                <div
                  className="text-[var(--color-subText)] cursor-pointer underline py-0.5 ml-[4px]"
                  onClick={toggleCommentBox}
                >
                  발자국 {post.comments.length}개 모두보기...
                </div>
              )}
              {showBox && (
                <PostComments postId={post._id} comments={post.comments} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
