import { Link } from 'react-router-dom';
import Info from '../atoms/Info';
import Interest from '../atoms/Interest';
import Tag from '../atoms/Tag';
import LogoImage from '../../assets/images/logo.png';

export default function CommunityCard({
  post,
  likeId,
}: {
  post: Post;
  likeId: string | null;
}) {
  console.log('CommunityCard render:', post.title);
  return (
    <div className="rounded-top-[6px] dark:border-dark-border dark:bg-dark-card h-[340px] w-[270px] rounded-[6px] border border-[#d9d9d9] duration-300 hover:shadow-md dark:shadow-black">
      <Link to={`/post/${post._id}`}>
        <div className="m-between relative h-[55%]">
          {post.image ? (
            <>
              <img
                src={post.image}
                className="h-[100%] w-[100%] rounded-t-[5px] object-cover"
              />
            </>
          ) : (
            <>
              <div className="cafe24 flex h-[100%] w-[100%] items-center justify-center gap-1 rounded-t-[5px] bg-[#755842] text-3xl leading-[0.9]">
                <img src={LogoImage} className="h-[40%] w-auto"></img>
                <p>
                  de:
                  <br />
                  caffeiene
                </p>
              </div>
            </>
          )}
          <div className="absolute right-[10px] bottom-[10px]">
            <Tag>{post.channel.description}</Tag>
          </div>
        </div>
      </Link>
      <div className="flex h-[45%] flex-col justify-between">
        <Link to={`/post/${post._id}`}>
          <div className="h-[90px] p-[15px]">
            <h3 className="nanum-gothic-bold dark:text-dark-text line-clamp-1 pr-[30px] text-base">
              {JSON.parse(post.title).title}
            </h3>
            <p className="nanum-gothic-regular dark:text-dark-text line-clamp-2 text-sm">
              {JSON.parse(post.title).body.replace(/<[^>]*>?/g, '')}
            </p>
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
    </div>
  );
}
