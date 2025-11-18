import * as contactsServices from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsServices.listContacts();

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
  const contact = await contactsServices.getContactById(id);
  if (!contact) {
    throw HttpError(404, `Not found`);
  }
  res.json(contact);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const removedContact = await contactsServices.removeContact(id);
  if (!removedContact) {
    throw HttpError(404, `Not found`);
  }
  res.json({ removedContact });
};

export const createContact = async (req, res) => {
  const newContact = await contactsServices.addContact(req.body);

  res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const updatedContact = await contactsServices.updateContact(id, req.body);
  if (!updatedContact) {
    throw HttpError(404, `Not found`);
  }
  res.json(updatedContact);
};
