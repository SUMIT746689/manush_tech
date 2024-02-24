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
  requiredPermissions?: string[];
}

export async function getServerSideProps(context: any) {
  // console.log({ context: context })
  const { req, query, res, asPath, pathname } = context;
  if (req) {
    let host = req.headers.host // will give you localhost:3000
    console.log({ host })
  } 
  // console.log({ req })
  //   console.log({ host })
  let blockCount: any = { holidays: [] };
  try {
    // const headersList = headers();
    // const domain = headersList.get('host')
  }
  catch (err) {
    console.log({ err })
  }

  const parseJson = JSON.parse(JSON.stringify(blockCount));

  return { props: { blockCount: parseJson } }
}


export const Authenticated: FC<AuthenticatedProps> = (props) => {
  console.log({props})
  const { children, name = undefined, requiredPermissions = [] } = props;
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
    } else if (requiredPermissions.length > 0) {
      let isPermitted = false;

      const permissionsArray = auth?.user?.permissions?.length > 0 ? auth?.user?.permissions?.map((permission: any) => permission.value) : [];

      for (const permission of requiredPermissions) {
        if (permissionsArray.includes(permission)) {
          isPermitted = true;
          break;
        }
      };
      console.log({ isPermitted })
      if(isPermitted) setVerified(true)
      else router.back();

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
