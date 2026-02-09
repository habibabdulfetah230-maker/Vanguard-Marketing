import Testimonial from "./testimonial.model.js";

const createTestimonial = async ({ name, role, testimonial, externalLink, photoUrl }) => {
  const item = await Testimonial.create({
    name,
    role,
    testimonial,
    externalLink,
    photoUrl,
  });

  return item;
};

const listTestimonials = async () => {
  const items = await Testimonial.find().sort({ createdAt: -1 });
  return items;
};

const updateTestimonial = async (id, { name, role, testimonial, externalLink, photoUrl }) => {
  const update = {};
  if (name !== undefined) update.name = name;
  if (role !== undefined) update.role = role;
  if (testimonial !== undefined) update.testimonial = testimonial;
  if (externalLink !== undefined) update.externalLink = externalLink;
  if (photoUrl !== undefined) update.photoUrl = photoUrl;

  const item = await Testimonial.findByIdAndUpdate(id, update, { new: true });
  return item;
};

const deleteTestimonial = async (id) => {
  await Testimonial.findByIdAndDelete(id);
};

export { createTestimonial, listTestimonials, updateTestimonial, deleteTestimonial };
