import Button from '../components/button'
import NotFoundImg from '../assets/images/NotFound.svg'
import { useNavigate } from 'react-router'
export default function NotFound() {
  const navigate = useNavigate()
  const goToChannel = () => {
    navigate('/Channel')
  }
  return (
    <div className="flex flex-col justify-center items-center mt-[10%]">
      <img
        src={NotFoundImg}
        alt="NotFoundImg"
        className="w-[210px] h-[210px] mb-[70px]"
      />
      <h1 className="text-[54px] font-extrabold mb-[50px] text-[var(--color-notFound)]">
        PAGE NOT FOUND
      </h1>
      <p className="text-[var(--color-main-skyBlue)] text-[20px] font-bold mb-[15px]">
        길을 잃으셨나요?
      </p>
      <Button
        className="bg-[var(--color-main-navy)] w-[248px] h-[53px] text-[22px]"
        onClick={goToChannel}
      >
        TravelMate와 길 찾기
      </Button>
    </div>
  )
}
