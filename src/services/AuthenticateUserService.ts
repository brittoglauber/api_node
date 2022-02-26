import { getCustomRepository } from "typeorm"
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { UsersRepositories } from "../repositories/repositories"


interface IAuthenticateRequest {
  email: string;
  password: string;
}

class AuthenticateUserService {
  async execute({email, password}: IAuthenticateRequest) {

    const usersRepositories = getCustomRepository(UsersRepositories);

    const user = await usersRepositories.findOne({
      email
    })

    if(!user) {
      throw new Error("Email or password Incorrect !")
    }

    const passwordMatch = await compare(password, user.password);

    if(!passwordMatch) {
      throw new Error ("Email or password Incorrect !")
    }

    const token = sign({
      email: user.email
    }, "4aec22f22755bd6f0f4ce8aa289c3401", {
      subject: user.id, 
      expiresIn: "1d" 
    })

    return token;
  }
}

export {AuthenticateUserService}