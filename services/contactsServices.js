import Contact from "../db/models/Contact.js";

const listContacts = () => Contact.findAll();

const addContact = (payload) => Contact.create(payload);

const getContactById = (id) => Contact.findByPk(id);

const removeContact = async (contactId) => {
  const contact = await getContactById(contactId);
  if (!contact) return null;
  await contact.destroy();
  return contact;
};

const updateContact = async (id, payload) => {
  const contact = await getContactById(id);
  if (!contact) return null;
  await contact.update(payload);
  return contact;
};

async function updateStatusContact(contactId, body) {
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    return null;
  }
  await contact.update({ favorite: body.favorite });
  return contact;
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
