import jwt from "jsonwebtoken";

export const protect = async(req, res, next) => { //decode token into req.user
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({message: "No token"});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //continuation
        req.user = decoded;
        next();
    } catch (error) {
        //block
        return res.status(401).json({message: "Invalid token"});
    }
}