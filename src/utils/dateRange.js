function GetDateRange(range) {
    const now = new Date();
    let startDate;

    switch (range) {
        case 'yesterday':
            startDate = new Date();
            startDate.setDate(now.getDate() - 1);
            startDate.setHours(0, 0, 0, 0);
            now.setHours(23, 59, 59, 999);
            break;

        case '7days':
            startDate = new Date();
            startDate.setDate(now.getDate() - 6);
            break;

        case '15days':
            startDate = new Date();
            startDate.setDate(now.getDate() - 14);
            break;

        case '30days':
            startDate = new Date();
            startDate.setDate(now.getDate() - 29);
            break;

        default:
            startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
            now.setHours(23, 59, 59, 999);
            break;
    }

    return { startDate, endDate: now };
}

export default GetDateRange;
