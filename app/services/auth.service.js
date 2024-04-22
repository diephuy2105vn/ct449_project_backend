const jwt = require("jsonwebtoken");
const secretKey = "secret";

class AuthService {
    generateToken(user) {
        return new Promise(async (resolve, rejects) => {
            try {
                const userData = {
                    user: user,
                };

                const token = await jwt.sign({ data: userData }, secretKey, {
                    algorithm: "HS256",
                });
                resolve(token);
            } catch (err) {
                rejects(err);
            }
        });
    }
    verifyToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secretKey, (error, decoded) => {
                if (error) {
                    return reject(error);
                }
                resolve(decoded);
            });
        });
    }
}

module.exports = AuthService;
