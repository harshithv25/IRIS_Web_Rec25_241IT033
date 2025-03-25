import { User } from "@/schemas/schemas";

const email_regex = "\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*";
const rollNumber_regex = "\\d\\d\\d[A-Za-z][A-Za-z][A-Za-z]\\d\\d\\d";
const rollNumber_regex_optional = "\\d\\d\\d[A-Za-z][A-Za-z]\\d\\d\\d";

export function validateEmail(email: string) {
  return email.match(email_regex);
}

export function validateRegister(data: User) {
  const err = { isErr: false, errMessage: "" };

  if (!data.email.match(email_regex)) {
    err.isErr = true;
    err.errMessage = "Enter a valid email";
  }

  if (
    !data.roll_number.match(rollNumber_regex) &&
    !data.roll_number.match(rollNumber_regex_optional)
  ) {
    err.isErr = true;
    err.errMessage = "Enter a valid Roll Number";
  }

  if (data.password && data.password.length < 6) {
    err.isErr = true;
    err.errMessage = "Invalid length of the password";
  }

  if (
    data.role.toLowerCase() !== "admin" &&
    data.role.toLowerCase() !== "user"
  ) {
    err.isErr = true;
    err.errMessage = "Role has to be either admin/user";
  }

  return { isErr: err.isErr, errMessage: err.errMessage };
}
