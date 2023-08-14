import {
  Avatar,
  Card,
  Grid,
  Tooltip,
  Typography
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useReactToPrint } from 'react-to-print';
import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import dayjs from 'dayjs';
import parse from 'html-react-parser';

export function GenerateCertificateExport({ _for = "employee", publicationDate, datas, template }) {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `student_certificate.pdf`,

    // copyStyles: true,
    // print: async (printIframe: HTMLIFrameElement) => {
    // 	const document = printIframe.contentDocument;
    // 	if (document) {
    // 		const html = document.getElementsByTagName('html')[0];
    // 		console.log(html);
    // 		await html2pdf().from(html).save();
    // 	}
    // }
  });

  return (
    <>
      <Grid
        onClick={handlePrint}
        sx={{ ':hover': { cursor: 'pointer' } }}
      >
        <Tooltip title={'Export Pdf'} arrow>
          <PictureAsPdfIcon sx={{ fontSize: '35px' }} />
        </Tooltip>
      </Grid>

      <div
        style={{ display: 'none' }}
      >
        <Grid ref={componentRef}>

          <GenerateCertificate _for={_for} publicationDate={publicationDate} datas={datas} template={template} />


        </Grid>
      </div>
    </>
  );
}

export const GenerateCertificate = ({ _for, publicationDate, datas, template, width = "1123px", height = "794px" }) => {
  const { user } = useAuth()
  const description = template.content

  console.log({ datas })
  return (
    datas.map((data) => {
      if (!data) return
      let size = description.length;
      let container = ''
      for (let i = 0; i < size; i++) {
        if (description[i] == '{') {
          let centralFlag = false
          while (description[i] == '{') {
            let cnt = '', helper = '';
            helper += description[i];
            i++;
            while (1) {
              if (description[i] == '}' || description[i] == '{') {
                break;
              }
              helper += description[i];
              cnt += description[i];
              i++;
            }
            if (description[i] == '{') {
              cnt = helper;
              centralFlag = true
            }

            console.log({ data })
            if (cnt != '') {
              const flag = data?.student_info ? data.student_info[`${cnt}`] : data[`${cnt}`]
              if (!flag && flag != 0) {
                if (centralFlag) {
                  container += cnt
                } else {
                  container += `{${cnt}}`
                }

              } else {
                container += flag
              }

            }

          }
        } else {
          container += description[i]
        }

      }
      // console.log(container);
      return (
        <Card
          key={data.id}
          sx={{
            width,
            height,
            pt: `${template.top_space}px`,
            pb: `${template.bottom_space}px`,
            pl: `${template.left_space}px`,
            pr: `${template.right_space}px`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundImage: `url(/api/get_file/${template.background_url})`,
            backgroundPosition: 'center',
            // backgroundSize: '100%',
            // backgroundSize: 'contain',
            // breakAfter: true,
            mt: 4,
            boxShadow: 'none',
            // p: '15px',
            pageBreakAfter: 'always'

          }} >
          <Grid
            display="flex"
            flexDirection="column"
            alignContent="space-between"
            justifyContent="space-between"
            sx={{
              textAlign: 'center',
              height: "100%"
            }}
            container
          >
            <Grid item display="grid" container>
              <Typography variant='h3'> {user?.school?.name}</Typography>
              <Typography variant='h5'> {user?.school?.email}</Typography>
              <Typography variant='h5'> {user?.school?.address}</Typography>
            </Grid>

            <Grid item container py={3} display="flex" justifyContent="space-around" alignItems="center" >
              <Typography width={300} textAlign="center" variant='h5'> {_for === "student" ? `Registration No: ${data?.class_registration_no}` : `Staff No:${data?.id}`}</Typography>
              <Avatar
                alt="logo"
                variant={template.photo_style}
                src={`/api/get_file/${data.student_photo}`}
                sx={{ width: template.photo_size, height: template.photo_size }}

              />
              <Typography width={300} variant='h5' textAlign={"center"}>{_for === "student" && `Addmission On: ${data?.created_at}`}</Typography>
            </Grid>


            <Typography textAlign="center" variant='h3'> {template.name}</Typography>
            <Grid pt={3} px={2}>
              {/* {parse(description, first_name)} */}
              <div dangerouslySetInnerHTML={{ __html: container }}></div>
            </Grid>


            <Grid pt={4} display="flex" justifyContent="space-between" alignItems="center">
              <Typography textAlign="center" variant='h5'> Date Of Publication: {dayjs(publicationDate).format('DD-MM-YYYY')}</Typography>
              <Avatar
                alt="signature"
                // variant={template.photo_style}
                src={`/api/get_file/${template.signature_url}`}
                sx={{ width: template.photo_size, height: template.photo_size }}
              />
            </Grid>

          </Grid>
        </Card>
      )
    }
    )
  )
}


