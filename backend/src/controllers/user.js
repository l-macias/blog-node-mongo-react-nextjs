import { User } from "../models/user.js";

class UserController {
  constructor() {}
  read(req, res) {
    try {
      req.profile.hashed_passowrd = undefined;
      return res.json(req.profile);
    } catch (error) {
      console.log("Error en metodo read");
    }
  }
}

const read = new UserController().read;
export { read };
