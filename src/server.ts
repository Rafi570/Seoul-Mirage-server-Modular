import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

async function main() {
  try {
    if (!config.database_url) {
      throw new Error("DATABASE_URL is not defined in .env");
    }

    await mongoose.connect(config.database_url);
    console.log("✨ Database is humming along");

    app.listen(config.port, () => {
      console.log(`🚀 Server is listening on port ${config.port}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

main();