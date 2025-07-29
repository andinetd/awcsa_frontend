import { Button } from "@/components/ui/button";
import Navbar from "@/layout/common/navbar";
import Link from "next/link";

export default function Home() {
  return (
    // <div className="flex flex-col gap-3 justify-center items-center h-screen">
    //   <h1 className={"text-2xl font-lexend"}>
    //     {"Women's, children and social affairs Dev Team."}
    //   </h1>
    //   <div className="flex flex-col items-start justify-center gap-3">
    //     <Link href={"/bureau-head"}>Bureau Head</Link>
    //     <Link href={"/adoption/dashboard"}>Adoption module</Link>
    //     <Link href={"/social-affairs/socials/dashboard"}>Socials module</Link>
    //     <Link href={"/womens/dashboard"}>women module</Link>
    //     <Link href={"/social-affairs/edir/23"}>Edir </Link>
    //     <Link href={"/super-admin"}>Super admin</Link>
    //   </div>

    //   <Link href={"/login"}>
    //     <Button>Login</Button>
    //   </Link>
    // </div>

    <div className="relative">
      <Navbar />
    </div>
  );
}
