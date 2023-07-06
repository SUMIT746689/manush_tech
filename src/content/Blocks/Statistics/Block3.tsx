import {
  Typography,
  Box,
  Avatar,
  Card,
  Grid,
  useTheme,
  styled
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import ArrowDownwardTwoToneIcon from '@mui/icons-material/ArrowDownwardTwoTone';
import ReceiptTwoToneIcon from '@mui/icons-material/ReceiptTwoTone';
import ArrowUpwardTwoToneIcon from '@mui/icons-material/ArrowUpwardTwoTone';
import SupportTwoToneIcon from '@mui/icons-material/SupportTwoTone';
import YardTwoToneIcon from '@mui/icons-material/YardTwoTone';
import SnowmobileTwoToneIcon from '@mui/icons-material/SnowmobileTwoTone';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
      color:  ${theme.colors.alpha.trueWhite[100]};
      width: ${theme.spacing(5.5)};
      height: ${theme.spacing(5.5)};
`
);

function Block3({ blockCount }) {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  return (
    <Grid container justifyContent="center" spacing={2}>
      {blockCount?.admins && (
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              px: 3,
              py: 2
            }}
          >
            <Box display="flex" alignItems="center">
              <AvatarWrapper
                sx={{
                  background: `${theme.colors.gradients.blue4}`
                }}
              >
                <ReceiptTwoToneIcon fontSize="small" />
              </AvatarWrapper>
              <Typography
                sx={{
                  ml: 1.5,
                  fontSize: `${theme.typography.pxToRem(15)}`,
                  fontWeight: 'bold'
                }}
                variant="subtitle2"
                component="div"
              >
                {t('Number of Admins')}
              </Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              sx={{
                ml: -2,
                pt: 2,
                pb: 1.5,
                justifyContent: 'center'
              }}
            >
              {/* <ArrowDownwardTwoToneIcon
              sx={{
                color: `${theme.colors.error.main}`
              }}
            /> */}
              <Typography
                sx={{
                  pl: 1,
                  fontSize: `${theme.typography.pxToRem(35)}`
                }}
                variant="h1"
              >
                {blockCount?.admins?.count}
              </Typography>
            </Box>
            {/* <Typography
            align="center"
            variant="body2"
            noWrap
            color="text.secondary"
            component="div"
          >
            <b>+36%</b> from last month
          </Typography> */}
          </Card>
        </Grid>
      )}
      {blockCount?.students && (
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              px: 3,
              py: 2
            }}
          >
            <Box display="flex" alignItems="center">
              <AvatarWrapper
                sx={{
                  background: `${theme.colors.gradients.orange3}`
                }}
              >
                <SupportTwoToneIcon fontSize="small" />
              </AvatarWrapper>
              <Typography
                sx={{
                  ml: 1.5,
                  fontSize: `${theme.typography.pxToRem(15)}`,
                  fontWeight: 'bold'
                }}
                variant="subtitle2"
                component="div"
              >
                {t('Number of Students')}
              </Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              sx={{
                ml: -2,
                pt: 2,
                pb: 1.5,
                justifyContent: 'center'
              }}
            >
              {/* <ArrowUpwardTwoToneIcon
              sx={{
                color: `${theme.colors.success.main}`
              }}
            /> */}
              <Typography
                sx={{
                  pl: 1,
                  fontSize: `${theme.typography.pxToRem(35)}`
                }}
                variant="h1"
              >
                {blockCount?.students?.count}
              </Typography>
            </Box>
            {/* <Typography
            align="center"
            variant="body2"
            noWrap
            color="text.secondary"
            component="div"
          >
            <b>+65%</b> from last month
          </Typography> */}
          </Card>
        </Grid>
      )}
      {blockCount?.teachers && (
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              px: 3,
              py: 2
            }}
          >
            <Box display="flex" alignItems="center">
              <AvatarWrapper
                sx={{
                  background: `${theme.colors.success.main}`
                }}
              >
                <YardTwoToneIcon fontSize="small" />
              </AvatarWrapper>
              <Typography
                sx={{
                  ml: 1.5,
                  fontSize: `${theme.typography.pxToRem(15)}`,
                  fontWeight: 'bold'
                }}
                variant="subtitle2"
                component="div"
              >
                {t('Number of Teachers')}
              </Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              sx={{
                ml: -2,
                pt: 2,
                pb: 1.5,
                justifyContent: 'center'
              }}
            >
              {/* <ArrowUpwardTwoToneIcon
              sx={{
                color: `${theme.colors.success.main}`
              }}
            /> */}
              <Typography
                sx={{
                  pl: 1,
                  fontSize: `${theme.typography.pxToRem(35)}`
                }}
                variant="h1"
              >
                {blockCount?.teachers?.count}
              </Typography>
            </Box>
            {/* <Typography
            align="center"
            variant="body2"
            noWrap
            color="text.secondary"
            component="div"
          >
            <b>+22%</b> from last month
          </Typography> */}
          </Card>
        </Grid>
      )}
      {blockCount?.schools && (
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              px: 3,
              py: 2
            }}
          >
            <Box display="flex" alignItems="center">
              <AvatarWrapper
                sx={{
                  background: `${theme.colors.primary.main}`
                }}
              >
                <SnowmobileTwoToneIcon fontSize="small" />
              </AvatarWrapper>
              <Typography
                sx={{
                  ml: 1.5,
                  fontSize: `${theme.typography.pxToRem(15)}`,
                  fontWeight: 'bold'
                }}
                variant="subtitle2"
                component="div"
              >
                {t('Number of Schools')}
              </Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              sx={{
                ml: -2,
                pt: 2,
                pb: 1.5,
                justifyContent: 'center'
              }}
            >
              {/* <ArrowDownwardTwoToneIcon
              sx={{
                color: `${theme.colors.warning.main}`
              }}
            /> */}
              <Typography
                sx={{
                  pl: 1,
                  fontSize: `${theme.typography.pxToRem(35)}`
                }}
                variant="h1"
              >
                {blockCount?.schools?.count}
              </Typography>
            </Box>
            <Typography
              align="center"
              variant="body2"
              noWrap
              color="text.secondary"
              component="div"
            >
              {/* <b>-15.35%</b> from last month */}
            </Typography>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}

export default Block3;
