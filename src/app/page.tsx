import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1>{"Women's, children and social affairs Dev Team."}</h1>
      <Link href={"/bureauHead"}>Bureau Head</Link>
      <Link href={"/adoption"}>Adoption module</Link>
      <Link href={"/social-affairs"}>Socials module</Link>
      <Link href={"/womens"}>women module</Link>
      <Link href={"/social-affairs/edir"}>Edir </Link>
      <Link href={"/super-admin"}>Super admin</Link>

      <Button>Test button</Button>
    </div>
  );
}
