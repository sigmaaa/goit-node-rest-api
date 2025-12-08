import * as fs from "node:fs/promises";
import path from "node:path";

import bcrypt from "bcrypt";
import gravatar from "gravatar";

import User from "../db/models/user.js";
import HttpError from "../helpers/HttpError.js";
import { createToken, verifyToken } from "../helpers/jwt.js";
import sendEmail from "../helpers/sendEmail.js";
import "dotenv/config";

const { PUBLIC_URL } = process.env;
const avatarDir = path.resolve("public", "avatars");
export const registerUser = async (payload) => {
  const { email, password } = payload;
  const avatarURL = gravatar.url(email);

  const existing = await User.findOne({
    where: { email },
  });
  if (existing) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = User.create({
    ...payload,
    avatarURL: avatarURL,
    password: hashPassword,
    token: verificationToken,
  });

  await sendEmailWithPayload(email);
  return user;
};

const sendEmailWithPayload = async (email) => {
  const verificationToken = createToken({ email });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${PUBLIC_URL}/api/auth/verify/${verificationToken}" target="_blank">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);
};
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) throw HttpError(401, "Email or password invalid");

  if (!user.verify) throw HttpError(401, "Email is't verified");

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpError(401, "Email or password invalid");

  const payload = {
    id: user.id,
  };

  const token = createToken(payload);

  await user.update({ token });
  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
};

export const findUser = (where) => User.findOne({ where });

export const logoutUser = async (user) => {
  await user.update({ token: null });

  return true;
};

export const updateAvatar = async (user, file) => {
  if (file) {
    const newPath = path.join(avatarDir, file.filename);
    await fs.rename(file.path, newPath);
    await user.update({ avatarURL: newPath });
  }
  return true;
};

export const verifyUser = async (verificationToken) => {
  const { data, error } = verifyToken(verificationToken);
  if (error) throw HttpError(401, error.message);

  const user = await findUser({ email: data.email });
  if (user.verify) throw HttpError(401, "Email already verified");

  await user.update({ verify: true });
};

export const resendVerifyUser = async (body) => {
  const { email } = body;

  const existing = await User.findOne({
    where: { email },
  });
  if (existing && existing.verify)
    throw HttpError(400, "Verification has already been passed");

  await sendEmailWithPayload(email);

  if (!email) throw HttpError(400, "missing required field email");
};
