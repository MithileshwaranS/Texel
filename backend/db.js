// import pkg from "pg";
// import dotenv from "dotenv";
// const { Client } = pkg;
// import { createClient } from '@supabase/supabase-js';

// dotenv.config();

// const client = new Client({
//     user: process.env.PG_USER,
//     host: process.env.PG_HOST,
//     database: process.env.PG_DATABASE,
//     password: process.env.PG_PASSWORD,
//     port: process.env.PG_PORT,
// });

// // export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// try {
//     await client.connect();
//     console.log("db connected successfully")
// } catch (err) {
//     console.error("Connection error",err.stack);
// }

// export default client;

// // // import dotenv from "dotenv";
// // // import { createClient } from '@supabase/supabase-js';

// // // dotenv.config();

// // // const supabaseUrl = process.env.SUPABASE_URL; // not VITE_
// // // const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// // import { createClient } from '@supabase/supabase-js';
// // import dotenv from 'dotenv';

// // dotenv.config();

// // const supabaseUrl = process.env.SUPABASE_URL;
// // const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// // const supabase = createClient(supabaseUrl, supabaseAnonKey);

// // // ✅ TEST connection with dummy fetch
// // async function checkConnection() {
// //   try {
// //     const { data, error } = await supabase.from('yarncount').select('*').limit(1); // change table name if needed
// //     if (error) throw error;
// //     console.log("✅ Supabase DB connected successfully");
// //   } catch (err) {
// //     console.error("❌ Supabase connection error:", err.message);
// //   }
// // }

// // checkConnection();

// // export default supabase;
