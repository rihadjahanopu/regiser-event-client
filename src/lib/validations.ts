import * as z from "zod";

export const registrationSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  mobile: z.string().regex(/^(\+88)?01[3-9]\d{8}$/, "Invalid Bangladeshi mobile number."),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  gender: z.enum(["Male", "Female", "Other"], { message: "Please select a gender" }),
  dob: z.string().optional().or(z.literal("")),
  fatherName: z.string().optional().or(z.literal("")),
  address: z.string().min(5, "Address is required."),
  district: z.string().min(2, "District is required."),
  schoolName: z.string().min(3, "School / College Name is required."),
  class: z.string().min(1, "Class is required."),
  subjectGroup: z.string().min(2, "Subject / Group is required."),
  rollNumber: z.string().optional().or(z.literal("")),
  bloodGroup: z.string().optional().or(z.literal("")),
  emergencyContact: z.string().regex(/^(\+88)?01[3-9]\d{8}$/, "Invalid Bangladeshi mobile number.").optional().or(z.literal("")),
  passingYear: z.string().optional().or(z.literal("")),
  gradeGpa: z.string().optional().or(z.literal("")),
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
