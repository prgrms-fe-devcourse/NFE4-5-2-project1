export default function WriteInfoMenu({
  iconSrc,
  tagName,
}: {
  iconSrc: string
  tagName: string
}) {
  return (
    <>
      <div className=" w-[90px] h-[50px] p-2 flex gap-[8px] items-center justify-center">
        <div>
          <img src={iconSrc} alt="iconImage"></img>
        </div>
        <span className="text-[18px] ">{tagName}</span>
      </div>
    </>
  )
}
