import AuthBoard from "../components/Auth/AuthBoard";
import Logo from "../components/Auth/Logo";
import LogIn from "../components/Auth/LogIn";

export default function LoginPage() {
  return (
    <>
      <AuthBoard>
        <header>
          <Logo />
        </header>
        <LogIn />
      </AuthBoard>
    </>
  );
}
