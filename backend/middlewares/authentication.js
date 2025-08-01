import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(token, req.body);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).redirect("/login");
    }

    // Attach user info to request object
    req.user = decoded;

    next(); // Proceed to the next middleware or route
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).redirect("/login");
  }
};

export default authMiddleware;

export const authMiddlewareP = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object
    req.user = decoded;

    res.status(200);
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).redirect("/login");
  }
};
