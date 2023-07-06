export type Data = {
  header_image: string;
  school_id: number;
  history_photo: string;
  history_description: string;
  chairman_photo: string;
  chairman_speech: string;
  principal_photo: string;
  principal_speech: string;
}| null ;

export interface ResultProps {
  data: Data;
  reFetchData: Function;
}