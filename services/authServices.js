import * as fs from "node:fs/promises";
import path from "node:path";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";

import User from "../db/models/user.js";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";

const avatarDir = path.resolve("public", "avatars");
export const registerUser = async (payload) => {
  const { email, password } = payload;
  const avatarURL = gravatar.url(email);

  const user = await User.findOne({
    where: { email },
  });
  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  return User.create({
    ...payload,
    avatarURL: avatarURL,
    password: hashPassword,
  });
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) throw HttpError(401, "Email or password invalid");

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
