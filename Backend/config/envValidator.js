export const validateEnv = () => {
  const criticalVars = ["JWT_SECRET", "MONGO_URI", "SESSION_SECRET"];
  const missingCriticals = [];

  for (const v of criticalVars) {
    if (!process.env[v]) {
      missingCriticals.push(v);
    }
  }

  if (missingCriticals.length > 0) {
    console.error(`❌ CRITICAL ERROR: Missing environment variables: ${missingCriticals.join(", ")}`);
    process.exit(1);
  }

  const optionalVars = ["SMTP_USER", "SMTP_PASS"];
  const missingOptionals = [];

  for (const v of optionalVars) {
    if (!process.env[v]) {
      missingOptionals.push(v);
    }
  }

  if (missingOptionals.length > 0) {
    console.warn(`⚠️  WARNING: Missing optional environment variables: ${missingOptionals.join(", ")}. Email functionality may fail.`);
  }

  console.log("✅ Environment configuration validated");
};
