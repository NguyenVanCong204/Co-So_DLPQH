function GetDateRange(range) {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    let startDate = new Date();

    switch (range) {
        case 'yesterday':
            startDate.setDate(startDate.getDate() - 1);
            break;
        case '7days':
            startDate.setDate(startDate.getDate() - 6);
            break;
        case '15days':
            startDate.setDate(startDate.getDate() - 14);
            break;
        case '30days':
            startDate.setDate(startDate.getDate() - 29);
            break;
        default:
            break;
    }

    startDate.setHours(0, 0, 0, 0);
    return { startDate, endDate };
}
export default GetDateRange;
