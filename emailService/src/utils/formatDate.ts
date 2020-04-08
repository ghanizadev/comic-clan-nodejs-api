export default (date : Date) => {
    let formated;
    var options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'long',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
    };
    formated = date.toLocaleDateString('en-US', options);
    return formated;
}