import * as Yup from 'yup';
import type { FC } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import Link from 'src/components/Link';

import {
  Box,
  Button,
  FormHelperText,
  TextField,
  CircularProgress,
  Grid,
  styled,
  Switch
} from '@mui/material';
import { useAuth } from 'src/hooks/useAuth';
import { useRefMounted } from 'src/hooks/useRefMounted';
import { useTranslation } from 'react-i18next';
import { TextFieldWrapper } from '@/components/TextFields';


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

export const LoginJWT: FC = (props) => {
  const { t }: { t: any } = useTranslation();
  const { login } = useAuth() as any;
  const isMountedRef = useRefMounted();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      terms: true,
      submit: null
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .max(255)
        .required(t('The username field is required')),
      // email: Yup.string()
      //   .email(t('The email provided should be a valid email address'))
      //   .max(255)
      //   .required(t('The email field is required')),
      password: Yup.string()
        .max(255)
        .required(t('The password field is required')),
      terms: Yup.boolean().oneOf(
        [true],
        t('You must agree to our terms and conditions')
      )
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await login(values.username, values.password);

        if (isMountedRef()) {
          const backTo =
            (router.query.backTo as string) || '/';
          router.push(backTo);
        }
      } catch (err) {
        console.error(err);
        if (isMountedRef()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    }
  });

  return (
    <form style={{display:"grid",gap:40}} noValidate onSubmit={formik.handleSubmit} {...props}>
      <Grid >
        <Grid sx={{ fontWeight: 600, fontSize: 36 }}>Welcome</Grid>
        <Grid sx={{ fontWeight: 400, fontSize: 18 }}>Login into your account</Grid>
      </Grid>

      <Grid>
        <TextField
          error={Boolean(formik.touched.username && formik.errors.username)}
          fullWidth
          margin="normal"
          helperText={formik.touched.username && formik.errors.username}
          label={t('User Name')}
          name="username"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          value={formik.values.username}
          variant="outlined"
        />

        <TextField
          error={Boolean(formik.touched.password && formik.errors.password)}
          fullWidth
          margin="normal"
          helperText={formik.touched.password && formik.errors.password}
          label={t('Password')}
          name="password"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="password"
          value={formik.values.password}
          variant="outlined"
        />
        <Grid sx={{ fontSize: 12, display: "flex", justifyContent: "start", gap: 2 }}>
          <AntSwitch /> Remember Me
        </Grid>
        {/* <Box
        alignItems="center"
        display={{ xs: 'block', md: 'flex' }}
        justifyContent="space-between"
      >
        <Box display={{ xs: 'block', md: 'flex' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.terms}
                name="terms"
                color="primary"
                onChange={formik.handleChange}
              />
            }
            label={
              <>
                <Typography variant="body2">
                  {t('I accept the')}{' '}
                  <Link href="#">{t('terms and conditions')}</Link>.
                </Typography>
              </>
            }
          />
        </Box>
        <Link href="/auth/recover-password">
          <b>{t('Lost password?')}</b>
        </Link>
      </Box> */}

        {Boolean(formik.touched.terms && formik.errors.terms) && (
          <FormHelperText error>{formik.errors.terms}</FormHelperText>
        )}
      </Grid>

      <Button
        sx={{
          mt: 3
        }}
        color="primary"
        startIcon={
          formik.isSubmitting ? <CircularProgress size="1rem" /> : null
        }
        disabled={formik.isSubmitting}
        type="submit"
        fullWidth
        size="large"
        variant="contained"
      >
        {t('Sign in')}
      </Button>
    </form>
  );
};
