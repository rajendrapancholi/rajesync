import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

(async () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Please provide at least one password. Usage:  bun createHash.ts pass1 ...");
    process.exit(1);
  }

  console.log("Generating hashes...\n");

  for (const password of args) {
    try {
      const hashed = await hashPassword(password);
      console.log(`${password} => ${hashed}`);
    } catch (error) {
      console.error(`Failed to hash ${password}:`, error);
    }
  }
})();
