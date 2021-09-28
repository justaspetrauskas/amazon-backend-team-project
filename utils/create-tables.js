import pg from "pg";

const { DATABASE_URL, DATABASE_URL_DEV, NODE_ENV } = process.env;
const isProduction = NODE_ENV === "production";
console.log("database url " + DATABASE_URL);
const connectionString = DATABASE_URL;
const sslConfig = isProduction
  ? {
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {};

export const pool = new pg.Pool({ connectionString, ...sslConfig });
console.log("database pool " + pool);
// create tables
const query = `--DROP TABLE IF EXISTS products;
                CREATE TABLE IF NOT EXISTS 
                products (
                    product_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                    name VARCHAR (50) NOT NULL,
                    decription TEXT NOT NULL,
                    image_URL TEXT NOT NULL,
                    brand VARCHAR (50) NOT NULL,
                    price FLOAT NOT NULL,
                    category VARCHAR (50) NOT NULL,
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                    
                );
                --DROP TABLE IF EXISTS products;
                CREATE TABLE IF NOT EXISTS 
                reviews (
                    review_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                    comment TEXT NOT NULL,
                    rate INTEGER NOT NULL,
                    product INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                    
                );
                `;

export const createTables = async () => {
  try {
    await pool.query(query);
    console.log("Default tables are created ✅");
  } catch (error) {
    console.log(error);
    console.log("Default tables are not created ❌");
  }
};
