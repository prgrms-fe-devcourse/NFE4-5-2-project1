import LogoImage from '../../assets/images/logo.png';

export default function NotFound() {
  return (
    <>
      <div className="dark:text-dark-text mt-[-2%] flex h-screen cursor-default flex-col items-center justify-center">
        <div className="flex flex-row items-end">
          <h2 className="nanum-gothic-regular text-3xl text-[#6B4C36]">
            Not Found
          </h2>
          <img
            src={LogoImage}
            className="h-[70px] rotate-270 dark:contrast-75 dark:invert"
          ></img>
        </div>
        <h1 className="nanum-gothic-bold text-9xl">404</h1>
      </div>
    </>
  );
}
