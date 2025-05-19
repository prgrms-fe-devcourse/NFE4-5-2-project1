type HashtagProps = {
  text: string;
  variant: "filled" | "empty";
};

export default function Hashtag({ text, variant }: HashtagProps) {
  const baseStyle =
    "inline-flex items-center h-[35px] px-[24px] rounded-[50px] border text-[10px] sm:text-[12px] md:text-[16px] font-regular";

  const filledStyle = {
    backgroundColor: "var(--primary-300)",
    color: "black",
    borderColor: "var(--primary-300)",
  };

  const emptyStyle = {
    backgroundColor: "var(--bg-color)",
    color: "var(--primary-300)",
    borderColor: "var(--primary-300)",
  };

  const style = variant === "filled" ? filledStyle : emptyStyle;

  return (
    <div className={baseStyle} style={style}>
      # {text}
    </div>
  );
}
