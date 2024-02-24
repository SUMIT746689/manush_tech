import { useAuth } from '@/hooks/useAuth';
import { Box, Card, Typography, styled, Grid } from '@mui/material';
import Link from 'src/components/Link';

const FooterWrapper = styled(Card)(
  ({ theme }) => `
        border-radius: 0;
        margin-top: ${theme.spacing(4)};
`
);

function Footer() {
  const auth = useAuth();
  const { user } = auth;
  // @ts-ignore
  const { adminPanel } = user ?? {};
  const { copy_right_txt } = adminPanel ?? {};
  // console.log({ adminPanel })

  return (
    <Grid>
      <FooterWrapper className="footer-wrapper">
        <Box
          p={4}
          display={{ xs: 'block', md: 'flex' }}
          alignItems="center"
          textAlign={{ xs: 'center', md: 'left' }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="subtitle1">
              &copy; {copy_right_txt ? copy_right_txt : '2023 - School Management System'}
            </Typography>
          </Box>
          <Typography
            sx={{
              pt: { xs: 2, md: 0 }
            }}
            variant="subtitle1"
          >
            Crafted by{' '}
            <Link
              href="https://mram.com.bd/"
              target="_blank"
              rel="noopener noreferrer"
            >
              MRAM Technologies Ltd
            </Link>
          </Typography>
        </Box>
      </FooterWrapper>
    </Grid>
  );
}

export default Footer;
