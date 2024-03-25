import { getAudioDurationInSeconds } from 'get-audio-duration';

export const handleGetFileDuration = async (path): Promise<any> => {
    console.log({ path });
    let duration = null;
    let err = null;
    await getAudioDurationInSeconds(path)
        .then((duration_) => {
            duration = duration_
        })
        .catch(err_ => {
            err = err_
        })
    return [duration, err];
}