import ContactSubmission from "./contact.model.js";

const createContactSubmission = async ({ name, email, phone, company, message }) => {
  const submission = await ContactSubmission.create({
    name,
    email,
    phone,
    company,
    message,
  });
  return submission;
};

const listContactSubmissions = async () => {
  const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
  return submissions;
};

const markAsRead = async (id) => {
  const submission = await ContactSubmission.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  );
  return submission;
};

const deleteContactSubmission = async (id) => {
  await ContactSubmission.findByIdAndDelete(id);
};

export { createContactSubmission, listContactSubmissions, markAsRead, deleteContactSubmission };
