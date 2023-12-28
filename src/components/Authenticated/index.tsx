import type { FC, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useAuth } from 'src/hooks/useAuth';
import { Slide } from '@mui/material';
import useNotistick from '@/hooks/useNotistick';

interface AuthenticatedProps {
  children: ReactNode;
  name?: string;
}

export const Authenticated: FC<AuthenticatedProps> = (props) => {
  const { children, name = undefined } = props;
  const auth = useAuth();
  // console.log("auth", auth);
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const { showNotification } = useNotistick();

  const permissionsArray =
    auth?.user?.permissions?.length > 0
      ? auth?.user?.permissions?.map((permission: any) => permission.group)
      : [];
  // console.log("permissionsArray__", permissionsArray);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (auth?.error) showNotification(auth?.error, 'error');

    if (!auth.isAuthenticated) {
      router.push({
        pathname: '/login',
        query: { backTo: router.asPath }
      });
    } else if (name && !permissionsArray.includes(name)) {
      router.back();
    } else {
      setVerified(true);
      showNotification('You are successfully authenticated!');
    }
  }, [router.isReady]);

  if (!verified) {
    return null;
  }

  return <>{children}</>;
};

Authenticated.propTypes = {
  children: PropTypes.node
};
