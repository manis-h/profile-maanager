  import { Router } from "express";
  import { registerMail } from "../controllers/mailer.js";
  import * as controller from '../controllers/controller.js'
  import Auth ,{localVariables} from '../middleware/auth.js'
  const router =Router();
// .Post Method
router.route('/register').post(controller.register)
router.route('/registerMail').post(registerMail)
router.route('/authenticate').post(controller.verifyUser ,(req,res)=>res.end())
router.route('/login').post( controller.verifyUser ,controller.login)
// Get Methods
router.route('/user/:username').get(controller.getUser)
router.route('/generateOTP').get( controller.verifyUser , localVariables, controller.generateOTP)
router.route('/verifyOTP').get(controller.verifyUser ,controller.verifyOTP)

router.route('/createResetSession').get(controller.createResetSession)

// PUT METHOD
router.route('/updateUser').put(Auth,controller.updateUser)
router.route('/resetPassword').put(controller.verifyUser ,controller.resetPassword)

  export default router