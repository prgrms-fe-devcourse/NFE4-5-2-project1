import Tag from '../atoms/Tag';
import Icon from '../atoms/Icon';
import Info from '../atoms/Info';
import Interest from '../atoms/Interest';
import { Link } from 'react-router-dom';

export default function QuestionCard({
  post,
  likeId,
}: {
  post: Post;
  likeId: string | null;
}) {
  return (
    <div className="dark:border-dark-border dark:bg-dark-card dark:text-dark-text flex h-[190px] w-[100%] flex-col justify-between rounded-[5px] border border-[#d9d9d9] duration-300 ease-in-out hover:shadow-md dark:shadow-black">
      <Link to={`/post/${post._id}`}>
        <div className="items-between flex flex-col">
          <div className="flex h-[91px] flex-col p-[15px]">
            <div className="inline-flex w-[100%] gap-[5px]">
              <span className="nanum-gothic-bold line-clamp-1 max-w-[70%] text-base break-all">
                {JSON.parse(post.title).title}
              </span>
              {post.channel.description === '해결' && (
                <Icon name="completeIcon" size={20} />
              )}
            </div>
            <div className="nanum-gothic-regular line-clamp-2 text-sm">
              {JSON.parse(post.title).body.replace(/<[^>]*>?/g, '')}
            </div>
          </div>
          <div className="relative flex gap-[5px] overflow-hidden pl-[15px] whitespace-nowrap">
            {JSON.parse(post.title).tags.map((t: string, index: number) => (
              <Tag key={index}>{t}</Tag>
            ))}
            <div className="dark:bg-dark-card absolute right-0 h-[30px] w-[15px] bg-white transition-colors duration-300" />
          </div>
        </div>
      </Link>
      <div className="dark:border-dark-border mx-[10px] flex flex-row items-center justify-between border-t border-[#d9d9d9] px-[5px] py-[10px]">
        <Info
          size={30}
          userName={
            (post.author && (post.author as User).fullName) || '탈퇴한 사용자'
          }
          timestamp={post.createdAt}
          imageUrl={post.author && (post.author as User).image}
          userId={(post.author && (post.author as User)._id) || 'user'}
        />
        <Interest
          commentCount={post.comments.length}
          like={{ likeCount: post.likes.length, likeId: likeId }}
          _id={post._id}
        />
      </div>
    </div>
  );
}
