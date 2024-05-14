
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

export const getToday = () => {
  const today = new Date(Date.now());
  const day = today.getDay();
  return days[day];
}

// for(let i=0; i<12;i++){
export const lastDateOfMonth = ({ monthInt, date = new Date() }) => new Date(date.getFullYear(), monthInt + 1, 0);
// const month = lastDateOfMonth().toLocaleString('default', { month: 'long' });
// console.log(month);
// console.log(lastDateOfMonth().getMonth(), lastDateOfMonth().getDate())
// }

export const monthList = [
  "january"
  , "february"
  , "march"
  , "april"
  , "may"
  , "june"
  , "july"
  , "august"
  , "september"
  , "october"
  , "november"
  , "december"
  ,]