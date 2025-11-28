import HttpError from "../helpers/HttpError.js";
import * as contactsServices from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const contacts = await contactsServices.listContacts(ownerId);

    res.status(200).json({
      status: "success",
      code: 200,
      data: { contacts },
    });
  } catch (err) {
    next(err);
  }
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user.id;
  const contact = await contactsServices.getContactById(id, ownerId);
  if (!contact) {
    throw HttpError(404, `Not found`);
  }
  res.json(contact);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user.id;
  const removedContact = await contactsServices.removeContact(id, ownerId);
  if (!removedContact) {
    throw HttpError(404, `Not found`);
  }
  res.json(removedContact);
};

export const createContact = async (req, res) => {
  const ownerId = req.user.id;

  const newContact = await contactsServices.addContact({
    ...req.body,
    owner: ownerId,
  });

  res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user.id;
  const updatedContact = await contactsServices.updateContact(
    id,
    ownerId,
    req.body
  );
  if (!updatedContact) {
    throw HttpError(404, `Not found`);
  }
  res.json(updatedContact);
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;
    const body = req.body;

    const contact = await contactsServices.updateStatusContact(
      id,
      ownerId,
      body
    );
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};
