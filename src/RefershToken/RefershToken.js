import auth from '../API/auth';

async function refreshToken() {
    try {
        let tokenRefresh = localStorage.getItem('tokenRefresh');

        if (!tokenRefresh) {
            return alert('No refresh token found');
        }

        const res = await auth.post(
            '/refresh-token',
            {},
            {
                headers: {
                    Authorization: `Bearer ${tokenRefresh}`,
                },
            },
        );

        return res.data.token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return alert('Lỗi máy chủ');
    }
}
export default refreshToken;
