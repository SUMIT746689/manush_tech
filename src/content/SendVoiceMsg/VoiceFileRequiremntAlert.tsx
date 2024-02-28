import { ButtonWrapper } from "@/components/ButtonWrapper";
import { Button, Card, Dialog, Divider, Grid, Slide, Typography } from "@mui/material"
import { TransitionProps } from '@mui/material/transitions';
import React from "react";
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const VoiceFileRequiremntAlert = ({ voiceFileRequiremntShow, setVoiceFileRequiremntShow }) => {
    const handleClose = () => {
        setVoiceFileRequiremntShow(false)
    }
    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={voiceFileRequiremntShow}
            onClose={handleClose}
            TransitionComponent={Transition}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
        >
            <Card sx={{ borderRadius: '1px' }} >
                <Grid px={2} py={1} fontSize={18} display="flex" justifyContent="space-between" >
                    <Grid my="auto">Voice File Requirements</Grid>
                    <Grid><Button size="small" variant="outlined" sx={{borderSize:2}} onClick={handleClose}><b><CloseIcon sx={{fontWeight:600}}/></b></Button></Grid>
                </Grid>
                <Divider />
                <Grid display="grid" px={2} py={4} rowGap={2} justifyContent="start">
                    <Typography variant="h2" fontWeight={300}>Voice File Format Instructions</Typography>

                    <Grid>
                        The voice file needs to be in (WAV) format and IVR compatible. Please convert your audio file from the link below before uploading.
                    </Grid>


                    <Grid display="flex" justifyContent="start"><a href="https://g711.org"><ButtonWrapper handleClick={() => { }} variant="text" >https://g711.org</ButtonWrapper></a> </Grid>

                    <Grid fontStyle="italic">
                        <b>Formatting options:</b><br />
                        Output Format: BroadWorks 17sp4+ SD (8Khz, Mono, 16-Bit PCM)
                        Volume: High
                    </Grid>
                </Grid>
                <Divider />
                <Grid display="flex" justifyContent="end" px={2} py={1}><ButtonWrapper variant="contained" handleClick={handleClose} sx={{ maxWidth: 'fit-content', ml: 'auto' }}>Close</ButtonWrapper></Grid>
            </Card>
        </Dialog>
    )
}