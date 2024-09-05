import jwt from "jsonwebtoken";

const verifyToken = async (req:any,res:any,next:any) => {
    try {
        const token = req.headers["authorization"];

        if(!token){
            return res.status(401).send("Token not available");
        }

        jwt.verify(token,process.env.SECRET_KEY as string, (err:any , decoded:any)=>{
            if (err) {
                return res.status(401).send('Invalid Token');
            }

            req.fid = decoded.id;
            req.email = decoded.email;
            next();
        })
    } catch (error) {
        throw new Error(error as string);
    }
}

export default verifyToken;