interface UserNameProps {
  name: string;
  className?: string;
}

// className을 props로 tailwind css 적용가능
export default function UserName({ name, className = "" }: UserNameProps) {
  return <span className={`${className}`}>{name}</span>;
}
