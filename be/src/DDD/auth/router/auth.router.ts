import { LOGGER } from "core";
import { Router } from "express";
import { RegisterPhoneDTO } from "../dto/registerPhone.dto";
import authService from "../authentication/services/auth.service";
import { LoginDTO } from "../dto/login.dto";

const AuthRouter = Router();

AuthRouter.post("/logout", async (req, res) => {
  try {
    const { userId } = req.params as { userId: string };

    const logout = await authService.userLogout(userId);
    res.status(logout.status).json(logout);
  } catch (error) {
    LOGGER.error("Router - /logout:", error);
    throw error;
  }
})

AuthRouter.post("/owner-login", async (req, res) => {
  try {
    const { error } = RegisterPhoneDTO.validate(req.body); 
    if (error) {
      res.status(400).json({
        message: 'Bad request',
        reason: error.details
      })
    }

    const owner = await authService.ownerLogin(req.body);
    res.status(owner.status).json(owner);
  } catch (error) {
    LOGGER.error("Router - /owner-login:", error);
    throw error;
  }
})

AuthRouter.post("/employee-login", async (req, res) => {
  try {
    const { error } = LoginDTO.validate(req.body); 
    if (error) {
      res.status(400).json({
        message: 'Bad request',
        reason: error.details
      })
    }

    const employee = await authService.employeeLogin(req.body);
    res.status(employee.status).json(employee);
  } catch (error) {
    LOGGER.error("Router - /employee-login:", error);
    throw error;
  }
})

AuthRouter.post("/verify-owner-access-code", async (req, res) => {
  try {
    
  } catch (error) {
    LOGGER.error("Router - /verify-owner-access-code:", error);
    throw error;
  }
})

AuthRouter.post("/verify-employee-access-code", async (req, res) => {
  try {
    
  } catch (error) {
    LOGGER.error("Router - /verify-employee-access-code:", error);
    throw error;
  }
})

AuthRouter.post("/verify-employee-email", async (req, res) => {
  try {
    
  } catch (error) {
    LOGGER.error("Router - /verify-employee-email:", error);
    throw error;
  }
})

export default AuthRouter;

