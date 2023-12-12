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
