import { useRouter } from 'next/router';
import NextLink, { LinkProps } from 'next/link';
import React, { PropsWithChildren, useState, useEffect } from 'react';

type ActiveLinkProps = LinkProps & {
  className?: string;
  activeClassName: string;
};

const HOME_PATH = '/';

const ActiveLink = React.forwardRef<any, PropsWithChildren<ActiveLinkProps>>(
  ({ children, activeClassName, className, ...props }, ref) => {
    const { asPath, isReady } = useRouter();
    const [computedClassName, setComputedClassName] = useState(className);

    useEffect(() => {
      // Check if the router fields are updated client-side
      if (isReady) {
        // Dynamic route will be matched via props.as
        // Static route will be matched via props.href
        const linkPathname = new URL((props.as || props.href) as string, location.href).pathname;

        // Using URL().pathname to get rid of query and hash
        const activePathname = new URL(asPath, location.href).pathname;

        const isActiveSubPathname =
          activePathname.includes(linkPathname) && linkPathname !== HOME_PATH;

        const isActiveHomePathname = linkPathname === HOME_PATH && activePathname === HOME_PATH;
        const newClassName =
          isActiveSubPathname || isActiveHomePathname
            ? `${className} ${activeClassName}`.trim()
            : className;

        if (newClassName !== computedClassName) {
          setComputedClassName(newClassName);
        }
      }
    }, [asPath, isReady, props.as, props.href, activeClassName, className, computedClassName]);

    return (
      <NextLink className={computedClassName} {...props} ref={ref}>
        {children}
      </NextLink>
    );
  },
);
ActiveLink.displayName = 'ActiveLink';
export default ActiveLink;
