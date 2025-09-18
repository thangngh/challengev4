import { Request, Response, Router } from "express";
import userService from "../service/user.service";
import { CreateUserDTO } from "../dtos/createUser.dto";

const UserRouter = Router()

UserRouter.post("/create-user", async (req: Request, res: Response) => {
    try {

        const { error } = CreateUserDTO.validate(req.body)

        if (error) {
            res.status(400).json({
                message: 'Bad request',
                reason: error.details
            })
        }

        const user = await userService.createUser(req.body);

        res.json(user)
    } catch (error) {
        throw error;
    }
})

export default UserRouter;