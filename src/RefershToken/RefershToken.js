import apiAdmin from "../API/apiAdmin";

async function refershToken() {
  try {
    let tokenReferesh = localStorage.getItem("tokenReferesh");
    if (!tokenReferesh) {
      return alert("No refresh token found");
    }

    const res = await apiAdmin.post(
      "/refershtoken",
      {},
      {
        headers: {
          Authorization: `Bearer ${tokenReferesh}`,
        },
      }
    );

    return res.data.token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return alert("Lỗi máy chủ");
  }
}
export default refershToken;
