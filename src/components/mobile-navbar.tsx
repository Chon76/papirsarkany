import Link from 'next/link';
import { FC } from 'react';

import HamburgerIcon from '~/assets/hamburger.svg';
import { NavbarItems } from '~/lib/types';
import CartMenuItem from './cart-menu-item';
import NavMenuItem from './nav-menu-item';

type MobileNavbarProps = {
  navbarItems: NavbarItems;
};

const MobileNavbar: FC<MobileNavbarProps> = ({ navbarItems }) => {
  return (
    <div className="d-navbar border-b-4 border-black bg-white">
      <div className="d-navbar-start gap-1">
        <div className="d-dropdown">
          <div
            tabIndex={0}
            role="button"
            className="d-btn d-btn-ghost lg:hidden"
            aria-label="mobile navigation menu"
          >
            <HamburgerIcon className="h-5 w-5" />
          </div>
          <ul
            tabIndex={0}
            className="d-menu d-dropdown-content z-[1] mt-5 w-52 rounded-box bg-base-100 p-2 shadow"
            data-pw-e2e="hamburger-menu-content"
          >
            {navbarItems.rightItems.map((navbarItem) => (
              <NavMenuItem
                key={navbarItem.href.toString()}
                href={navbarItem.href}
              >
                {navbarItem.children}
              </NavMenuItem>
            ))}
            <div className="d-divider m-0"></div>
            {navbarItems.leftItems.map((navbarItem) => (
              <NavMenuItem
                key={navbarItem.href.toString()}
                href={navbarItem.href}
              >
                {navbarItem.children}
              </NavMenuItem>
            ))}
          </ul>
        </div>

        <div className="flex-none">
          <CartMenuItem />
        </div>
      </div>

      <div className="d-navbar-end">
        <Link
          href={'/'}
          className="d-btn d-btn-ghost normal-case min-[320px]:text-xl"
        >
          papirsarkany.hu
        </Link>
      </div>
    </div>
  );
};

export default MobileNavbar;
