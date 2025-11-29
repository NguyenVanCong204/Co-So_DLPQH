import jwt from "jsonwebtoken";
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized1" });
  }
  try {
    const decoded = jwt.verify(token, "van-cong");
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error during token verification :", error);
    return res.status(401).json({ error: "Unauthorized2" });
  }
};
export const authorize = (requiredLevel) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Chưa xác thực" });
    }
    // Convert both to numbers for comparison to handle string/number mismatch
    const userLevel = parseInt(req.user.level);
    const required = parseInt(requiredLevel);
    if (userLevel !== required) {
      return res
        .status(403)
        .json({ error: "Bạn không có quyền thực hiện tác vụ này" });
    }
    next();
  };
};
