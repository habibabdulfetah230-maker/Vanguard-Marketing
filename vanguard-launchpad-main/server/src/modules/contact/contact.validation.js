import { z } from "zod";

const submitContactSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().optional(),
    company: z.string().optional(),
    message: z.string().min(1, "Message is required"),
  }),
});

export { submitContactSchema };
