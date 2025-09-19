import { Timestamp } from 'firebase-admin/firestore'; 

import FirebaseService from "../../../core/framework/database/firebase";
import UserModel from "../models/user.models";
import { generateCode, renderTemplate } from '../../../helpers/utils';
import transporter from '../../../core/config/email.config';

class UserService {
  private static instance: UserService;
  private db: FirebaseFirestore.Firestore;
  private usersCollection: FirebaseFirestore.CollectionReference;

  private constructor() {
    this.db = FirebaseService.getInstance().getFirestore();
    this.usersCollection = this.db.collection("users");
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async createUser(user: UserModel) {

    const emailExists = await this.usersCollection.where("email", "==", user.email).limit(1).get();

    if (emailExists.empty) {
      return { status: 400, message: 'email already exists' }
    }

    const verifyCode = generateCode(6);
    const body = {
      ...user,
      isFirstLogin: true,
      verifyCodeFirstLogin: verifyCode,
      createdAt: Timestamp.now()
    }

    try {
      const created = await this.usersCollection.add(body);

      if (created.id) {

        transporter.sendMail({
          from: `"My App" <${CONFIG.mail.user}>`,
          to: user.email,
          subject: "Chào mừng!",
          text: `Hello world: This is accessCode: ${verifyCode}`,
        })
      }
      return { status: 201, message: 'Create user success', data: created };
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: string) {
    const user = await this.usersCollection.doc(id).get();

    if(!user.exists) {
      return { status: 400, message: 'User not found' }
    }

    return { status: 200, data: user }
  }
}

export default UserService.getInstance();