import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT || 5001,
  // ডাটাবেস নাম 'test' করে দেওয়া হলো আপনার ইচ্ছা অনুযায়ী
  database_url: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mdmdo0u.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0`,
  jwt_secret: process.env.JWT_SECRET,
  node_env: process.env.NODE_ENV || "development",
  
  // সরাসরি ব্যবহারের জন্য এখানেও রাখা হলো যাতে এরর না আসে
  frontend_url: process.env.FRONTEND_URL, 
  backend_url: process.env.BACKEND_URL,

  ssl: {
    store_id: process.env.STORE_ID,
    store_pass: process.env.STORE_PASSWORD,
    is_live: process.env.IS_LIVE === "true",
  },
  client: {
    root: process.env.CLIENT_ROOT,
    frontend_url: process.env.FRONTEND_URL,
  },
};