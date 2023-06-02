import { LinkProps } from '@mui/material/Link';
import NextLink from 'next/link';
import { forwardRef } from 'react';
const LinkBehaviour = forwardRef<HTMLAnchorElement, LinkProps>(function LinkBehaviour(
  props: any,
  ref,
) {
  return <NextLink ref={ref} {...props} />;
});

export default LinkBehaviour;
