import api from "../../API/api";

async function refershTokenAdmin() {
  try {
    let tokenReferesh = localStorage.getItem("tokenReferesh");
    if (!tokenReferesh) {
      return alert("No refresh token found");
    }

    const res = await api.post(
      "/admin/token",
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
export default refershTokenAdmin;
