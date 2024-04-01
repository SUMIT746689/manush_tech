// import { getAudioDurationInSeconds } from 'get-audio-duration';
import mm from 'music-metadata';
import util from 'util';


export const handleGetFileDuration = async (path): Promise<any> => {
    let duration = null;
    let err = null;
    try {
        const metadata = await mm.parseFile(path);

        if (typeof metadata.format?.duration === "number") duration = Math.floor(metadata.format?.duration);
        else throw new Error("audio duration not found")
    } catch (error) {
        err = error.message;
    }
    return [duration, err];
}

// export const handleGetOldFileDuration = async (path): Promise<any> => {
//     console.log({ path });
//     let duration = null;
//     let err = null;
//     await getAudioDurationInSeconds(path)
//         .then((duration_) => {
//             duration = duration_
//         })
//         .catch(err_ => {
//             err = err_
//         })
//     return [duration, err];
// };