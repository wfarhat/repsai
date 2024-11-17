"use client"

import { sidebarLinks } from "@/constants";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Bottombar() {
    // Get the current pathname to determine active links
    const pathname = usePathname();

    return (
        <section className="bottombar">
            {/* Show Home link only for signed-out users */}
            <SignedOut>
                <Link href="/" className="bottombar_link">
                    <Image src="/assets/home.svg" alt="Home" width={24} height={24} />
                    <p className="text-light-1 max-lg:hidden">Home</p>
                </Link>
            </SignedOut>

            {/* Render sidebar links for signed-in users */}
            <SignedIn>
                <div className="bottombar_container">
                    {sidebarLinks.map((link) => {
                        // Determine if the current link is active
                        const isActive =
                            (pathname.includes(link.route) && link.route.length > 1) ||
                            pathname === link.route;

                        return (
                            <Link
                                href={link.route}
                                key={link.label}
                                className={`bottombar_link ${isActive && "bg-primary-500"}`}
                            >
                                <Image
                                    src={link.imgURL}
                                    alt={link.label}
                                    width={24}
                                    height={24}
                                />
                                <p className="text-subtle-medium text-light-1 max-sm:hidden">
                                    {link.label.split(/\s+/)[0]}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </SignedIn>
        </section>
    );
}

export default Bottombar;
