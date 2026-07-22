import * as z from "zod";

export interface FieldConfig {
	email: boolean;
	dob: boolean;
	fatherName: boolean;
	rollNumber: boolean;
	regNumber: boolean;
	bloodGroup: boolean;
	emergencyContact: boolean;
	passingYear: boolean;
	gradeGpa: boolean;
}

export const DEFAULT_FIELD_CONFIG: FieldConfig = {
	email: false,
	dob: false,
	fatherName: false,
	rollNumber: false,
	regNumber: false,
	bloodGroup: false,
	emergencyContact: false,
	passingYear: false,
	gradeGpa: false,
};

export function buildDynamicSchema(config: Partial<FieldConfig> = {}) {
	const c = { ...DEFAULT_FIELD_CONFIG, ...config };

	return z.object({
		fullName: z.string().min(2, "Name must be at least 2 characters."),
		mobile: z
			.string()
			.regex(/^(\+88)?01[3-9]\d{8}$/, "Invalid Bangladeshi mobile number."),
		email: c.email
			? z.string().email("Invalid email format").min(1, "Email is required.")
			: z.string().email("Invalid email format").optional().or(z.literal("")),
		gender: z.enum(["Male", "Female", "Other"], {
			message: "Please select a gender",
		}),
		dob: c.dob
			? z.string().min(1, "Date of Birth is required.")
			: z.string().optional().or(z.literal("")),
		fatherName: c.fatherName
			? z.string().min(3, "Father's Name must be at least 3 characters.")
			: z.string().optional().or(z.literal("")),
		address: z.string().min(5, "Address is required."),
		district: z.string().min(2, "District is required."),
		schoolName: z.string().min(3, "School / College Name is required."),
		class: z.string().min(1, "Class is required."),
		subjectGroup: z.string().min(2, "Subject / Group is required."),
		rollNumber: c.rollNumber
			? z.string().min(1, "Roll Number is required.")
			: z.string().optional().or(z.literal("")),
		regNumber: c.regNumber
			? z.string().min(1, "Registration Number is required.")
			: z.string().optional().or(z.literal("")),
		bloodGroup: c.bloodGroup
			? z.string().min(1, "Blood Group is required.")
			: z.string().optional().or(z.literal("")),
		emergencyContact: c.emergencyContact
			? z
					.string()
					.regex(/^(\+88)?01[3-9]\d{8}$/, "Invalid Bangladeshi mobile number.")
			: z
					.string()
					.regex(/^(\+88)?01[3-9]\d{8}$/, "Invalid Bangladeshi mobile number.")
					.optional()
					.or(z.literal("")),
		passingYear: c.passingYear
			? z.string().min(4, "Passing Year is required.")
			: z.string().optional().or(z.literal("")),
		gradeGpa: c.gradeGpa
			? z.string().min(1, "GPA/Grade is required.")
			: z.string().optional().or(z.literal("")),
	});
}
