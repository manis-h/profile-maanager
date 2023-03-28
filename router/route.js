  import { Router } from "express";
  import { registerMail } from "../controllers/mailer.js";
  import * as controller from '../controllers/controller.js'
  import Auth ,{localVariables} from '../middleware/auth.js'
  const router =Router();
// .Post Method
router.route('/login').post( controller.verifyUser ,controller.login)
// Get Methods
router.route('/user/:username').get(controller.getUser)


  export default router