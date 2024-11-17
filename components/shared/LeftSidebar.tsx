"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignOutButton, SignedIn, SignedOut, useAuth } from "@clerk/nextjs";

import { sidebarLinks } from "@/constants";

const LeftSidebar = () => {
  // Initialize routing and authentication hooks
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">

        {/* Show Home link only for signed-out users */}
        <SignedOut>
          <Link href="/" className="leftsidebar_link">
            <Image src="/assets/home.svg" alt="Home" width={24} height={24} />
            <p className="text-light-1 max-lg:hidden">Home</p>
          </Link>
        </SignedOut>

        {/* Render sidebar links for signed-in users */}
        <SignedIn>
          {sidebarLinks.map((link) => {
            // Determine if the current link is active
            const isActive =
              (pathname.includes(link.route) && link.route.length > 1) ||
              pathname === link.route;

            return (
              <Link
                href={link.route}
                key={link.label}
                className={`leftsidebar_link ${isActive && "bg-primary-500 "}`}
              >
                <Image src={link.imgURL} alt={link.label} width={24} height={24} />
                <p className="text-light-1 max-lg:hidden">{link.label}</p>
              </Link>
            );
          })}
        </SignedIn>
      </div>

      {/* Render Logout button for signed-in users */}
      <SignedIn>
        <div className="mt-10 px-6">
          <SignOutButton redirectUrl="/">
            <div className="flex cursor-pointer gap-4 p-4">
              <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </div>
      </SignedIn>
    </section>
  );
};

export default LeftSidebar;
