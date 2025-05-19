import WriteInfo from '../components/WriteInfo'
import channelIcon from '../assets/icons/channelIcon.svg'
import leftArrowGray from '../assets/icons/leftArrowGray.svg'
import leftArrowNavy from '../assets/icons/leftArrowNavy.png'
import rightArrowGray from '../assets/icons/rightArrowGray.svg'
import rightArrowNavy from '../assets/icons/rightArrowNavy.png'
import pin from '../assets/icons/pin.svg'
import bedIcon from '../assets/icons/bedIcon.svg'
import photoPlusIcon from '../assets/icons/photoPlusIcon.png'
import deleteTags from '../assets/icons/deleteTags.png'
import { useRef, useState } from 'react'
import Button from '../components/button'
import { axiosInstance } from '../api/axios'
import { cloudinaryAxiosInstance } from '../api/cloudinaryAxios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import { useNavigate } from 'react-router-dom'

export default function Write() {
  const navigate = useNavigate()
  //이미지 등록
  const [images, setImages] = useState<string[]>([]) //미리보기용
  const [imageFiles, setImageFiles] = useState<File[]>([]) //image 필드용
  const [uploadedImages, setUploadedImages] = useState<string[]>([]) // 업로드된 이미지 URLs

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      const imgUrls = fileArray.map((file) => URL.createObjectURL(file))

      setImages(imgUrls)
      setImageFiles(fileArray)
      handleCloudinaryUpload(fileArray)
    }
  }

  const handleCloudinaryUpload = async (files: File[]) => {
    const uploadPromises = files.map((file) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'programmersProject2')

      return cloudinaryAxiosInstance
        .post('', formData)
        .then((response) => response.data.secure_url)
        .catch((error) => {
          console.error('Cloudinary 업로드 실패:', error)
          return null
        })
    })

    const uploadedUrls = await Promise.all(uploadPromises)

    // 실패한 이미지 URL은 제외하고 성공한 URL만 필터링
    const successfulUrls = uploadedUrls.filter((url) => url !== null)

    setUploadedImages(successfulUrls)

    // 업로드된 이미지 URLs 확인
    console.log('업로드된 이미지 URLs:', successfulUrls)
  }

  //이미지 슬라이더
  const [imgIndex, setImgIndex] = useState(0)
  const imageWidth = 216
  const handleLeftSlider = () => {
    setImgIndex((prev: number) => Math.min(prev + imageWidth, 0))
  }
  const handleRightSlider = () => {
    if (images.length > 3) {
      const maxIndex = -(imageWidth * (images.length + 1 - 4))
      setImgIndex((prev: number) => Math.max(prev - imageWidth, maxIndex))
    }
  }

  const [selectedChannelId, setSelectedChannelId] = useState('')
  const handleChannelChange = (id: string) => {
    console.log('선택된 채널 ID:', id)
    setSelectedChannelId(id)
  }

  const [writtenTitle, setWrittenTitle] = useState('')
  const handlerTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    if (title) {
      setWrittenTitle(title)
    }
  }

  const [locations, setLocations] = useState<string[]>([])
  const handleLocationsChange = (newTags: string[]) => {
    setLocations(newTags)
  }
  const [hotels, setHotels] = useState<string[]>([])
  const handleHotelsChange = (newTags: string[]) => {
    setHotels(newTags)
  }

  const [context, setContext] = useState('')
  const handlerContextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const context = e.target.value
    if (context) {
      setContext(context)
    }
  }
  const preventInvalidInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자가 아닌 입력값과 한글 입력을 필터링한다.
    e.target.value = e.target.value.replace(/[^0-9]/g, '')
  }

  const [cost, setCost] = useState('')
  const handlerCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cost = e.target.value
    if (cost) {
      setCost(cost)
    }
  }

  //tag 등록
  const [tags, setTags] = useState<string[]>([])
  const [isComposing, setIsComposing] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      const value = inputRef.current?.value.trim()
      if (value) {
        setTags([...tags, value])
        if (inputRef.current) inputRef.current.value = ''
      }
    }
  }

  //tag 삭제
  const deleteTag = (indexToDelete: number) => {
    setTags(tags.filter((_, index) => index !== indexToDelete))
  }

  const [loading, setLoading] = useState(false)
  //API POST
  const handleSubmit = async () => {
    if (!writtenTitle) {
      toast('제목을 입력하세요.')
      return
    }

    if (!selectedChannelId) {
      toast('채널을 선택하세요.')
      return
    }

    if (imageFiles.length === 0) {
      toast('이미지를 하나 이상 선택해주세요.')
      return // 이미지가 없으면 더 이상 진행하지 않음
    }

    const formData = new FormData()

    formData.append(
      'title',
      JSON.stringify({
        uploadedImages,
        writtenTitle,
        tags,
        locations,
        hotels,
        cost,
        context,
      })
    )

    //이미지 필드에는 썸네일용 첫번째 이미지만 넣기
    formData.append('image', imageFiles[0])

    formData.append('channelId', selectedChannelId)

    try {
      setLoading(true)
      const res = await axiosInstance.post('/posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('post 성공:', res.data)
      toast.success('게시 완료')
      navigate('/channel')
    } catch (error) {
      console.log('post 실패:', error)
      toast.error('게시 실패')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      {/* 전체 contents 박스 */}
      <div className="max-w-[1049px] w-full min-h-screen px-6 mx-auto relative">
        {/* 채널 선택 영역 */}
        <div className="w-full h-[110px] pt-[30px] pb-[30px] text-[var(--color-write-main-text)]">
          <WriteInfo
            iconSrc={channelIcon}
            tagName="채널"
            onSelectChange={handleChannelChange}
          ></WriteInfo>
        </div>

        {/* 이미지 영역 */}
        <div className="h-[210px] w-full pt-[5px] pb-[5px] flex relative overflow-hidden">
          <div className="flex justify-between items-center w-full">
            {/* 왼쪽 화살표 */}
            <div
              className="w-[60px] content-center absolute left-0 group"
              onClick={handleLeftSlider}
            >
              <img
                src={leftArrowGray}
                className="block group-hover:hidden cursor-pointer"
              />
              <img
                src={leftArrowNavy}
                className="hidden group-hover:block cursor-pointer"
              />
            </div>
            {/* 오른쪽 화살표 */}
            <div
              className="w-[60px] flex items-center justify-center content-center absolute right-0 group"
              onClick={handleRightSlider}
            >
              <img
                src={rightArrowGray}
                className="block group-hover:hidden cursor-pointer"
              />
              <img
                src={rightArrowNavy}
                className="hidden group-hover:block cursor-pointer"
              />
            </div>
          </div>

          {/* 이미지 보여지는 영역 */}
          <div className="h-full w-[860px]  flex overflow-hidden absolute left-[60px]">
            {/* 이미지 나열되는 영역 */}
            <div
              className=" absolute left-0 w-[4000px] flex flex-wrap gap-4 transition-transform duration-300"
              style={{ transform: `translateX(${imgIndex}px)` }}
            >
              {/* 선택된 이미지 영역 */}
              {images.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`preview-${index}`}
                  className="size-[200px] "
                />
              ))}
              {/* 이미지 선택 영역 */}
              <label
                htmlFor="file"
                className="w-[200px] h-[200px] flex  justify-center items-center rounded-xs cursor-pointer  bg-[var(--color-image-bg)] group"
              >
                <div className="flex flex-col justify-center items-center">
                  <img
                    src={photoPlusIcon}
                    alt="plus icon"
                    className="size-[30px] flex justify-center items-center transition-transform duration-200 group-hover:scale-125"
                  />
                </div>
              </label>
            </div>

            <input
              type="file"
              id="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        <div className="w-full h-[767px] pt-[30px]">
          {/* 제목 입력 영역 */}
          <input
            type="text"
            placeholder="제목을 입력하세요."
            className="h-[44px] w-full outline-none text-[var(--color-title)] placeholder-[#989B9D] font-bold text-[32px] "
            onChange={handlerTitleChange}
          />

          <div className="w-[78px] h-[5px] bg-[#434343] rounded-[2px] mt-[10px] mb-[10px]"></div>

          <div className="flex mb-[25px]">
            {/* 태그 입력 영역 */}
            <div className="flex items-start">
              <input
                type="text"
                onKeyDown={addTag}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                ref={inputRef}
                placeholder="태그를 입력하세요."
                className="h-[19px] w-[120px] outline-none text-[var(--color-tag)] placeholder-[#989B9D] font-bold text-[14px]  "
              />
            </div>
            <div className="flex items-start">
              <ul className="p-2 h-1/2 flex items-center">
                {tags.map((tag, index) => (
                  <li
                    key={index}
                    onClick={() => deleteTag(index)}
                    className="flex gap-[5px] items-center justify-center text-[10px] text-[#ffff] w-auto h-[22px] rounded-[15px] bg-[#2A728C] mr-[5px] px-[10px] cursor-pointer"
                  >
                    {tag}
                    <img src={deleteTags} alt="deleteTagsIcon" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* 위치 */}
          <div className="mb-[25px] text-[var(--color-write-main-text)]">
            <WriteInfo
              iconSrc={pin}
              tagName="위치"
              type="text"
              onTagChange={handleLocationsChange}
            ></WriteInfo>
          </div>
          {/* 숙소 */}
          <div className="mb-[25px] text-[var(--color-write-main-text)]">
            <WriteInfo
              iconSrc={bedIcon}
              tagName="숙소"
              type="text"
              onTagChange={handleHotelsChange}
            ></WriteInfo>
          </div>
          <hr className="mb-[20px] border-[#E4E4E4]"></hr>
          {/* 경비 */}
          <input
            type="number"
            placeholder="경비를 입력하세요."
            className="h-[22px] w-full outline-none placeholder-[#989B9D] text-[var(--color-write-main-text)] font-bold text-[16px] mb-[18px] "
            onChange={handlerCostChange}
            onInput={preventInvalidInput}
          />
          {/* 내용 입력 영역 */}
          <textarea
            placeholder="내용을 입력하세요."
            className="h-[364px] w-full text-[var(--color-write-main-text)] placeholder-[#989B9D] font-bold text-[24px] focus:outline-[#60b5ff] rounded-[10px]"
            onChange={handlerContextChange}
          />
        </div>
        {/* 버튼 */}
        <div className="flex gap-5 justify-end mb-2 mr-[80px]">
          <Button
            className="w-[120px] h-[40px] bg-white text-[var(--color-main-navy)] text-base font-bold rounded-[10px] border border-[#d1d1d1] hover:bg-[var(--color-red)] hover:text-white active:scale-[0.95]
          transition-bg duration-200"
            onClick={() => navigate('/channel')}
          >
            취소
          </Button>
          <Button
            className="w-[120px] h-[40px] bg-[var(--color-main-navy)]  text-white text-base font-bold rounded-[10px] hover:bg-[var(--color-main-navy-hover)] active:scale-[0.95]"
            onClick={handleSubmit}
          >
            저장
          </Button>
        </div>
      </div>
    </>
  )
}
