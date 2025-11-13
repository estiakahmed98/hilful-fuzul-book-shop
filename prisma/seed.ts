import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const adminEmail = "admin@example.com";
  const adminPassword = "Admin123!";

  const existing = await db.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log("Admin already exists:", existing.email);
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await db.user.create({
    data: {
      name: "Super Admin",
      email: adminEmail,
      passwordHash,
      role: "admin",
    },
  });

  console.log("Admin created successfully:");
  console.log("Email:", adminEmail);
  console.log("Password:", adminPassword);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await db.$disconnect();
  });
