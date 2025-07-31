import bcrypt from "bcrypt";

const hashValue = async (value: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedValue = await bcrypt.hash(value, salt);

  return hashedValue;
};

const compareValue = async (value: string, hash: string) =>
  await bcrypt.compare(value, hash).catch(() => false);

export { hashValue, compareValue };
