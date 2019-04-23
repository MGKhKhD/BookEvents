const jwt = require("jsonwebtoken");

module.exports = {
  authMW: (req, res, next) => {
    const auth = req.get("Authorization"); //Authorization is removed from the header
    //console.log("auth---", auth);

    if (!auth) {
      req.isAuthed = false;
      return next();
    }
    const token = auth.split(" ")[1]; // Bearer token
    //console.log("token---", token);
    if (!token) {
      req.isAuthed = false;
      return next();
    }
    try {
      const valid = jwt.verify(token, process.env.JWT_KEY);
      if (!valid) {
        req.isAuthed = false;
        return next();
      }
      req.isAuthed = true;
      req.userId = valid.userId;
      req.email = valid.email;
      next();
    } catch (err) {
      req.isAuthed = false;
      return next();
    }
  }
};
