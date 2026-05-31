export function formatDate(date){
    if(date === undefined) return "loading/error";
    if(date === null) return "completed";

    const [year, month, day] = date.split("-");

    return `${month}/${day}/${year}`;
}