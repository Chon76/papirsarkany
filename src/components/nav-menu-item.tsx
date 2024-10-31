'use client';

import Link, { LinkProps } from 'next/link';
import { FC, ReactNode } from 'react';

export type MenuItemProps = LinkProps & {
  children?: ReactNode;
};

const NavMenuItem: FC<MenuItemProps> = (props: MenuItemProps) => {
  const { children } = props;

  return (
    <li className="text-sm lg:text-base">
      <Link
        {...props}
        onClick={(e) => {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        }}
      >
        {children}
      </Link>
    </li>
  );
};

export default NavMenuItem;
