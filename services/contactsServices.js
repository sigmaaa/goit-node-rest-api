import Contact from "../db/models/contact.js";

const listContacts = (ownerId) =>
  Contact.findAll({
    where: {
      owner: ownerId,
    },
  });

const addContact = (payload) => Contact.create(payloadc);

const getContactById = (id, ownerId) =>
  Contact.findOne({
    where: {
      id,
      owner: ownerId,
    },
  });

const removeContact = async (contactId, ownerId) => {
  const contact = await getContactById(contactId, ownerId);
  if (!contact) return null;
  await contact.destroy();
  return contact;
};

const updateContact = async (id, ownerId, payload) => {
  const contact = await getContactById(id, ownerId);
  if (!contact) return null;
  await contact.update(payload);
  return contact;
};

async function updateStatusContact(contactId, ownerId, body) {
  const contact = await getContactById(contactId, ownerId);
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
