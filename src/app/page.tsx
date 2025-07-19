import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-3 justify-center items-center h-screen">
      <h1>{"Women's, children and social affairs Dev Team."}</h1>
      <Link href={"/bureau-head"}>Bureau Head</Link>
      <Link href={"/adoption/dashboard"}>Adoption module</Link>
      <Link href={"/social-affairs/socials/dashboard"}>Socials module</Link>
      <Link href={"/womens/dashboard"}>women module</Link>
      <Link href={"/social-affairs/edir/23"}>Edir </Link>
      <Link href={"/super-admin"}>Super admin</Link>

      <Link href={"/login"}>
        <Button>Login</Button>
      </Link>
    </div>
  );
}
