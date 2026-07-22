import * as z from "zod";

export interface FieldSetting {
	required: boolean; // true = required, false = optional
	enabled: boolean;  // true = show field, false = hide field
}

export interface FieldConfig {
	fullName: FieldSetting;
	mobile: FieldSetting;
	email: FieldSetting;
	gender: FieldSetting;
	dob: FieldSetting;
	fatherName: FieldSetting;
	schoolName: FieldSetting;
	class: FieldSetting;
	subjectGroup: FieldSetting;
	rollNumber: FieldSetting;
	regNumber: FieldSetting;
	passingYear: FieldSetting;
	gradeGpa: FieldSetting;
	address: FieldSetting;
	district: FieldSetting;
	bloodGroup: FieldSetting;
	emergencyContact: FieldSetting;
}

export const ALL_FIELD_KEYS: (keyof FieldConfig)[] = [
	"fullName",
	"mobile",
	"email",
	"gender",
	"dob",
	"fatherName",
	"schoolName",
	"class",
	"subjectGroup",
	"rollNumber",
	"regNumber",
	"passingYear",
	"gradeGpa",
	"address",
	"district",
	"bloodGroup",
	"emergencyContact",
];

export const DEFAULT_FIELD_CONFIG: FieldConfig = {
	fullName:         { required: false, enabled: true },
	mobile:           { required: false, enabled: true },
	email:            { required: false, enabled: true },
	gender:           { required: false, enabled: true },
	dob:              { required: false, enabled: false },
	fatherName:       { required: false, enabled: true },
	schoolName:       { required: false, enabled: true },
	class:            { required: false, enabled: true },
	subjectGroup:     { required: false, enabled: true },
	rollNumber:       { required: false, enabled: true },
	regNumber:        { required: false, enabled: true },
	passingYear:      { required: false, enabled: true },
	gradeGpa:         { required: false, enabled: true },
	address:          { required: false, enabled: true },
	district:         { required: false, enabled: true },
	bloodGroup:       { required: false, enabled: true },
	emergencyContact: { required: false, enabled: true },
};

function normalise(raw: any, defaults: FieldSetting): FieldSetting {
	if (raw === null || raw === undefined) return defaults;
	if (typeof raw === "boolean") {
		return { required: raw, enabled: true };
	}
	return {
		required: typeof raw.required === "boolean" ? raw.required : defaults.required,
		enabled:  typeof raw.enabled === "boolean" ? raw.enabled : defaults.enabled,
	};
}

export function normaliseFieldConfig(raw: any): FieldConfig {
	if (!raw || typeof raw !== "object") return DEFAULT_FIELD_CONFIG;
	const result = { ...DEFAULT_FIELD_CONFIG };
	for (const key of ALL_FIELD_KEYS) {
		result[key] = normalise(raw[key], DEFAULT_FIELD_CONFIG[key]);
	}
	return result;
}

export function buildDynamicSchema(config: Partial<FieldConfig> = {}) {
	const c = normaliseFieldConfig(config);

	const makeStringSchema = (
		setting: FieldSetting,
		requiredValidator: z.ZodTypeAny,
		optionalValidator: z.ZodTypeAny = z.string().optional().or(z.literal(""))
	) => {
		if (!setting.enabled) {
			return z.string().optional().or(z.literal(""));
		}
		return setting.required ? requiredValidator : optionalValidator;
	};

	return z.object({
		fullName: makeStringSchema(
			c.fullName,
			z.string().min(2, "Name must be at least 2 characters.")
		),

		mobile: makeStringSchema(
			c.mobile,
			z.string().regex(/^(\+88)?01[3-9]\d{8}$/, "Invalid Bangladeshi mobile number."),
			z.string().regex(/^(\+88)?01[3-9]\d{8}$/, "Invalid Bangladeshi mobile number.").optional().or(z.literal(""))
		),

		email: makeStringSchema(
			c.email,
			z.string().email("Invalid email format").min(1, "Email is required."),
			z.string().email("Invalid email format").optional().or(z.literal(""))
		),

		gender: !c.gender.enabled
			? z.string().optional().or(z.literal(""))
			: c.gender.required
				? z.enum(["Male", "Female", "Other"], { message: "Please select a gender" })
				: z.enum(["Male", "Female", "Other"]).optional().or(z.literal("")),

		dob: makeStringSchema(
			c.dob,
			z.string().min(1, "Date of Birth is required.")
		),

		fatherName: makeStringSchema(
			c.fatherName,
			z.string().min(2, "Father's Name must be at least 2 characters.")
		),

		schoolName: makeStringSchema(
			c.schoolName,
			z.string().min(2, "School / College Name is required.")
		),

		class: makeStringSchema(
			c.class,
			z.string().min(1, "Class is required.")
		),

		subjectGroup: makeStringSchema(
			c.subjectGroup,
			z.string().min(1, "Subject / Group is required.")
		),

		rollNumber: makeStringSchema(
			c.rollNumber,
			z.string().min(1, "Roll Number is required.")
		),

		regNumber: makeStringSchema(
			c.regNumber,
			z.string().min(1, "Registration Number is required.")
		),

		passingYear: makeStringSchema(
			c.passingYear,
			z.string().min(4, "Passing Year is required.")
		),

		gradeGpa: makeStringSchema(
			c.gradeGpa,
			z.string().min(1, "GPA/Grade is required.")
		),

		address: makeStringSchema(
			c.address,
			z.string().min(3, "Address is required.")
		),

		district: makeStringSchema(
			c.district,
			z.string().min(2, "District is required.")
		),

		bloodGroup: makeStringSchema(
			c.bloodGroup,
			z.string().min(1, "Blood Group is required.")
		),

		emergencyContact: makeStringSchema(
			c.emergencyContact,
			z.string().regex(/^(\+88)?01[3-9]\d{8}$/, "Invalid Bangladeshi mobile number."),
			z.string().regex(/^(\+88)?01[3-9]\d{8}$/, "Invalid Bangladeshi mobile number.").optional().or(z.literal(""))
		),
	});
}
