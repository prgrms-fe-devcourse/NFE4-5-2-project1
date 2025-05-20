export default function Checkbox({ id }: { id?: string }) {
  return (
    <>
      <input
        type="checkbox"
        id={id}
        className="h-[20px] w-[20px] cursor-pointer accent-[#6b4c36]"
      ></input>
    </>
  );
}
