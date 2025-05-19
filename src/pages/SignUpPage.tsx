import AuthBoard from "../components/Auth/AuthBoard";
import Logo from "../components/Auth/Logo";
// import SignUp from "../components/Auth/SignUp";
import SubmitForm from "../components/SignUp/SubmitForm";

export default function SignUpPage() {
  return (
    <>
      <AuthBoard>
        <header>
          <Logo />
        </header>
        <SubmitForm />
      </AuthBoard>
    </>
  );
}
