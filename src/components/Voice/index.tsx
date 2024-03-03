export const VoiceFileShow = ({ src }) => {
    return (
        <audio
            style={{ width: "100%",display:"block",height:"40px" }}
            controls
            src={src}>
            Your browser does not support the
            <code>audio</code> element.
        </audio>
        // <Grid container pt={0.5}>File Name: {preview_file.name}</Grid>
    )
}
