import dayjs from 'dayjs';
import moment from 'moment';

export const convert_format_DateTimeFull = function () {
    const dateFormat = new Date();
    let day = dateFormat.getDate();
    let month = dateFormat.getMonth() + 1;
    const year = dateFormat.getFullYear();
    const hours = dateFormat.getHours();
    const mins = dateFormat.getMinutes();
    const mili = dateFormat.getSeconds();

    if (day < 10) {
        day = `0${day}`;
    }
    if (month < 10) {
        month = `0${month}`;
    }
    const result = `${day}/${month}/${year} ${hours}:${mins}:${mili}`;
    return result;
};
