import { Timestamp } from "firebase-admin/firestore";

import { LOGGER } from "../../../../core/framework";
import FirebaseService from "../../../../core/framework/database/firebase";
import TwilioService from "../../../../core/framework/twilio"
import { IEmployeeLogin, IRegisterPhone, IVerifyEmail } from "../../../../DDD/auth/types";
import { generateCode } from "../../../../helpers/utils";
import { ERole } from "../../../../DDD/user/types";
import jwtStrategy from "../strategies/jwt.strategy";
import { TokenHelper } from "../../../../helpers/auth";

class AuthService {
  private static instance: AuthService;
  private db: FirebaseFirestore.Firestore;

  public constructor() {
    this.db = FirebaseService.getInstance().getFirestore();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }

    return AuthService.instance;
  }

  async ownerLogin(body: IRegisterPhone) {
    const { phoneNumber } = body;
    const result = await this.db.runTransaction(
      async (transaction) => {

        const userRef = this.db.collection("users").doc();
        const accessCodeRef = this.db.collection("access_codes").doc();

        const phoneQuery = this.db
          .collection("users")
          .where("phoneNumber", "==", phoneNumber)
          .limit(1);

        const phoneSnapshot = await transaction.get(phoneQuery);
        const verifyCode = generateCode(6);

        if (phoneSnapshot.empty) {
          transaction.set(userRef, {
            phoneNumber,
            isFirstLogin: true,
            role: ERole.OWNER,
            createdAt: Timestamp.now(),
            verifyCodeFirstLogin: verifyCode,
            refreshToken: null
          });
  
          return { status: 200, id: userRef.id, verifyCode };
        }

        const isRoleOwner = phoneSnapshot.docs[0].data().role === ERole.OWNER;
        if (!isRoleOwner) {
          LOGGER.warn("This phone number is registered as a different role");
          return { error: true, status: 401, message: "Forbidden" };
        }

        const validateExpireQuery = this.db
          .collection("access_codes")
          .where("userId", "==", phoneSnapshot.docs[0].id)
          .where("isUse", "==", false)
          .where("expireAt", ">", Timestamp.now())
          .limit(1);

        const validateExpireSnapshot = await transaction.get(validateExpireQuery);
        if (!validateExpireSnapshot.empty) {
          LOGGER.info("There is a valid access code, please use it");
          return { error: true, status: 400, message: "There is a valid access code, please use it" };
        }

        const accessBody = {
          accessCode: verifyCode,
          userId: phoneSnapshot.docs[0].id,
          expireAt: Timestamp.fromMillis(Date.now() + 5 * 60 * 1000),
          isUse: false,
        };
        transaction.set(accessCodeRef, accessBody);

        return { status: 200, id: userRef.id, verifyCode, phoneNumber };
      }
    )

    if (!result.error) {
      await TwilioService.sendSms(
        result.phoneNumber as string,
        `Your verification code is: ${result.verifyCode}`
      );
    }
    return result;
  }

  async verifyOwnerAccessCode(userId: string, accessCode: string) {
    try {
      const accessCodeQuery = this.db
        .collection("access_codes")
        .where("userId", "==", userId)
        .where("accessCode", "==", accessCode)
        .where("isUse", "==", false)
        .where("expireAt", ">", Timestamp.now())
        .limit(1);

      const accessCodeSnapshot = await accessCodeQuery.get();

      if (accessCodeSnapshot.empty) {
        LOGGER.warn("Invalid or expired access code");
        return { status: 400, message: "Invalid or expired access code" };
      }

      const accessCodeDoc = accessCodeSnapshot.docs[0];
      await accessCodeDoc.ref.update({ isUse: true });

      const { accessToken, refreshToken } = await jwtStrategy.signToken(userId)

      const hashRefreshToken = await TokenHelper.hashToken(refreshToken);

      await this.db.collection("users")
        .doc(userId)
        .update({ refreshToken: hashRefreshToken });
      
      return { status: 200, message: "Access code verified successfully", accessToken, refreshToken };
    } catch (error) {
      LOGGER.error("Error verifying access code:", error);
      return { status: 500, message: "Internal server error" };
    }
  }

  async employeeVerifyEmail(body: IVerifyEmail) {
    const { email, accessCode } = body;
    try {
      const accessCodeQuery = this.db
        .collection("users")
        .where("email", "==", email)
        .where("role", "==", ERole.EMPLOYEE)
        .where("verifyCodeFirstLogin", "==", accessCode)
        .limit(1);

      const accessCodeSnapshot = await accessCodeQuery.get();

      if (accessCodeSnapshot.empty) {
        LOGGER.warn("Invalid email or access code");
        return { status: 400, message: "Invalid email or access code" };
      }

      const userDoc = accessCodeSnapshot.docs[0];
      await userDoc.ref.update({ verifyCodeFirstLogin: null, isFirstLogin: false });

      return { status: 200, message: "Email verified successfully" };  
    } catch (error) {
      LOGGER.error("Error verifying email:", error);
      throw error;
    }
  }

  async employeeLogin(body: IEmployeeLogin) {
    const { username, password } = body;
    try {
      const userQuery = this.db
        .collection("users")
        .where("email", "==", username)
        .where("role", "==", ERole.EMPLOYEE)
        .limit(1);

      const userSnapshot = await userQuery.get();

      if (userSnapshot.empty) {
        LOGGER.warn("Invalid username or password");
        return { status: 401, message: "Invalid username or password" };
      }

      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();

      if (userData.isFirstLogin) {
        LOGGER.warn("Please verify your email first");
        return { status: 401, message: "Please verify your email first" };
      }

      const comparePassword = await TokenHelper.compareToken(password, userData.password);
      if (!comparePassword) {
        LOGGER.warn("Invalid username or password");
        return { status: 401, message: "Invalid username or password" };
      }

      const { accessToken, refreshToken } = await jwtStrategy.signToken(userDoc.id)

      const hashRefreshToken = await TokenHelper.hashToken(refreshToken);

      await this.db.collection("users")
        .doc(userDoc.id)
        .update({ refreshToken: hashRefreshToken });
      
      return { status: 200, message: "Login successful", accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  async verifyEmployeeAccessCode(userId: string, accessCode: string) {
    try {
      const accessCodeQuery = this.db
        .collection("access_codes")
        .where("userId", "==", userId)
        .where("accessCode", "==", accessCode)
        .where("isUse", "==", false)
        .where("expireAt", ">", Timestamp.now())
        .limit(1);

      const accessCodeSnapshot = await accessCodeQuery.get();

      if (accessCodeSnapshot.empty) {
        LOGGER.warn("Invalid or expired access code");
        return { status: 400, message: "Invalid or expired access code" };
      }

      const accessCodeDoc = accessCodeSnapshot.docs[0];
      await accessCodeDoc.ref.update({ isUse: true });

      const { accessToken, refreshToken } = await jwtStrategy.signToken(userId)

      const hashRefreshToken = await TokenHelper.hashToken(refreshToken);

      await this.db.collection("users")
        .doc(userId)
        .update({ refreshToken: hashRefreshToken });
      
      return { status: 200, message: "Access code verified successfully", accessToken, refreshToken };
    } catch (error) {
      LOGGER.error("Error verifying access code:", error);
      throw error;
    }
  }

  async validRefreshToken(plainTextToken: string, hashTextToken: string) {
    return TokenHelper.compareToken(plainTextToken, hashTextToken);
  }

  async userLogout(userId: string) {
    try {
      await this.db.collection("users")
        .doc(userId)
        .update({ refreshToken: null });
      
      return { status: 200, message: "Logout successful" };
    } catch (error) {
      LOGGER.error("Error during logout:", error);
      return { status: 500, message: "Internal server error" };
    }
  }

  async refreshToken(userId: string, rfToken: string) {
    try {
      const userRef = this.db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return { status: 404, message: "User not found" };
      }

      const userData = userDoc.data();
      const isValid = await this.validRefreshToken(rfToken, userData?.refreshToken || "");

      if (!isValid) {
        return { status: 403, message: "Invalid refresh token" };
      }

      const { accessToken, refreshToken } = await jwtStrategy.signToken(userId)

      const hashRefreshToken = await TokenHelper.hashToken(refreshToken);

      await userRef.update({ refreshToken: hashRefreshToken });

      return { status: 200, message: "Token refreshed successfully", accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();