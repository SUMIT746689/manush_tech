import { getAudioDurationInSeconds } from 'get-audio-duration';
import { logFile } from './handleLogFile';

export const handleGetFileDuration = async (path):Promise<any> => {
    console.log({path})
    try{
    await getAudioDurationInSeconds(path)
        .then((duration) => {
            return [duration, null];
        })
        .catch(err => {
            console.log({err_____:err})
            logFile.error(err);
            return [null, err];
        })
    }
    catch(err){
        console.log({err})
    }
}