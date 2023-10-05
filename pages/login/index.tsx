import { Box, Card, styled, Grid, Switch } from '@mui/material';
import Head from 'next/head';
import { useAuth } from 'src/hooks/useAuth';
import { Guest } from 'src/components/Guest';
// import { LoginAuth0 } from 'src/content/Auth/Login/LoginAuth0';
// import { LoginFirebaseAuth } from 'src/content/Auth/Login/LoginFirebaseAuth';
import { LoginJWT } from 'src/content/Auth/Login/LoginJWT';
// import { LoginAmplify } from 'src/content/Auth/Login/LoginAmplify';
import { useTranslation } from 'react-i18next';
// import Logo from 'src/components/LogoSign';
import BaseLayout from 'src/layouts/BaseLayout';
// import Link from 'src/components/Link';
import { useRouter } from 'next/router';

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#1890ff',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));


const icons = {
  Auth0: '/static/images/logo/auth0.svg',
  FirebaseAuth: '/static/images/logo/firebase.svg',
  JWT: '/static/images/logo/jwt.svg',
  Amplify: '/static/images/logo/amplify.svg'
};

const CardImg = styled(Card)(
  ({ theme }) => `
    width: 90px;
    height: 80px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: ${theme.colors.alpha.white[100]};
    margin: 0 ${theme.spacing(1)};
    border: 1px solid ${theme.colors.alpha.black[10]};
    transition: ${theme.transitions.create(['all'])};

    &:hover {
      border-color: ${theme.colors.primary.main};
    }
`
);

const BottomWrapper = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(3)};
    display: flex;
    align-items: center;
    justify-content: center;
`
);

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex-direction: column;
`
);

const TopWrapper = styled(Box)(
  () => `
  display: flex;
  width: 100%;
  flex: 1;
`
);

function LoginBasic() {
  const { method } = useAuth() as any;
  const { t }: { t: any } = useTranslation();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Grid display={{ xs: "grid", sm: "block" }}>
        <Grid p={"68px"} maxWidth={{ xs: '250px', sm: '100%' }}>
          <img src="/login/MRAM logo 1.png" style={{ width: 150, height: "fit-content" }} />
        </Grid>
        <Grid
          sx={{
            width: { xs: '100%', sm: 500 },
            pl: { sx: "0", sm: "100px" },
            textAlign: "center",
            zIndex: "60"
          }}
        >
          <Grid maxWidth={400} px={{xs:4,sm:0}} mx="auto">
            {method === 'JWT' && <LoginJWT />}
          </Grid>
        </Grid>

        <Grid
          display="grid"
          sx={{ position: "absolute", zIndex: "-10", opacity: { xs: 0.1, lg: 1 }, width: "100%", height: "100vh", top: 0, right: 0 }}
        >
          <img src="/login/side_image.svg" style={{ position: "absolute", top: 0, right: 0, objectFit: "cover", width: "100vh", maxHeight: "100vh" }} />
        </Grid>
        <Grid sx={{ zIndex: "-60", background: "#F0F7FF", position: "absolute", top: 0, left: 0, right: 0, width: "100%", height: "100%" }}></Grid>

      </Grid>
    </>
  );
}

LoginBasic.getLayout = (page) => (
  <Guest>
    <BaseLayout>{page}</BaseLayout>
  </Guest>
);

export default LoginBasic;
