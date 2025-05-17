import { LoginForm } from "./login-form";

interface LoginModalProps extends React.ComponentProps<"div"> {
  onEmailLogin?: (email: string, password: string) => Promise<void>;
  onGoogleLogin?: () => Promise<void>;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  redirectAfterLogin?: string;
  backgroundImage?: string;
  title?: string;
  subtitle?: string;
  showLoginModal?: boolean;
}

export function LoginModal(props: LoginModalProps) {
  const { showLoginModal, ...restProps } = props;
  
  if (!showLoginModal) {
    return null;
  }
  // return <></>
  return (
    <div className="fixed top-0 left-0 w-screen flex flex-col items-center justify-center h-screen backdrop-blur-md z-50">
      <LoginForm {...restProps} />
    </div>
  )
}
