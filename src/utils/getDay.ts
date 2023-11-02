
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

export const getToday = ()=>{
  const today = new Date(Date.now());
  const day = today.getDay();
  return days[day];
}