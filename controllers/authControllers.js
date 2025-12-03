import {
  loginUser,
  logoutUser,
  registerUser,
  updateAvatar,
} from "../services/authServices.js";

export const registerController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);

    res.status(201).json({
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  await logoutUser(req.user);

  res.status(204).send();
};

export const getCurrentController = async (req, res, next) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

export const updateAvatarController = async (req, res, next) => {
  await updateAvatar(req.user, req.file);

  res.status(200).json({
    avatarURL: req.user.avatarURL,
  });
};
