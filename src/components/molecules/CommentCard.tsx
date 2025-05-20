export default function CommentCard({
  title,
  comment,
}: {
  title: string;
  comment: string;
}) {
  return (
    <>
      <div className="dark:border-dark-border dark:text-dark-text w-[100%] rounded-[5px] border border-[#d9d9d9] p-[15px] duration-300 hover:shadow-md dark:shadow-black">
        <p className="nanum-gothic-bold text-basic mb-[5px] line-clamp-1">
          "{title}" 글의 댓글
        </p>
        <p className="nanum-gothic-regular line-clamp-2 text-sm">{comment}</p>
      </div>
    </>
  );
}
