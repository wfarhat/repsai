import { OrganizationSwitcher, SignedIn, SignOutButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define the top navigation bar for the application
function Topbar() {
    const pathname = usePathname();

    return (
        <nav className='topbar'>
            {/* Logo and app name link */}
            <Link href='/' className='flex items-center gap-4'>
                <Image src='/assets/logo.png' alt='logo' width={28} height={28} />
                <p className='text-heading3-bold text-light-1 max-xs:hidden'>RepsAI</p>
            </Link>

            <div className='flex items-center gap-1'>
                {/* Logout button for smaller devices */}
                <div className='block md:hidden'>
                    <SignedIn>
                        <SignOutButton>
                            <div className='flex cursor-pointer'>
                                <Image
                                    src='/assets/logout.svg'
                                    alt='logout'
                                    width={24}
                                    height={24}
                                />
                            </div>
                        </SignOutButton>
                    </SignedIn>
                </div>

                {/* Organization switcher with Clerk's dark theme */}
                <OrganizationSwitcher
                    appearance={{
                        baseTheme: dark,
                        elements: {
                            organizationSwitcherTrigger: "py-2 px-4",
                        },
                    }}
                />
            </div>
        </nav>
    );
}

export default Topbar;
