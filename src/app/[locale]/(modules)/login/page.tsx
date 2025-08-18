import SignInForm from "@/components/shared/auth/sign-in-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center  px-4 ">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-10">
        {/* Left Side: Logo and Title */}
        <div className="flex flex-col items-center   text-center md:text-left">
          <img
            src="/assets/WCSA_logo.jpg"
            alt="logo"
            className="w-40 h-20 md:w-80 md:h-60 object-contain mb-8"
          />
          <p className="text-2xl font-semibold font-lexend">Welcome</p>
        </div>

        {/* Right Side: SignIn Form */}
        <Card className="w-full max-w-md flex flex-col  px-10 py-10">
          <h1 className="text-xl font-semibold font-lexend">Sign in</h1>
          <SignInForm />
        </Card>
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-xs flex flex-wrap justify-center items-center gap-2 px-4 text-foreground/65">
        <p className="font-medium text-center font-lexend">
          {`@${new Date().getFullYear()} Bureau of Women, children & social Affairs.`}
        </p>

        <p className="font-semibold cursor-pointer hover:scale-105 transition font-lexend">
          Addis Ababa
        </p>
      </div>
    </div>
  );
}
