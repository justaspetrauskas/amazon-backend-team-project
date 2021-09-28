import pg from "pg";

const { DATABASE_URL, LOCAL_DATABASE_URL, NODE_ENV } = process.env;
const isProduction = NODE_ENV !== "production";
const connectionString = isProduction ? DATABASE_URL : LOCAL_DATABASE_URL;
const sslConfig = isProduction
  ? {
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {};

export const pool = new pg.Pool({ connectionString, ...sslConfig });
// create tables
const query = `--DROP TABLE IF EXISTS products;
                CREATE TABLE IF NOT EXISTS 
                products (
                    product_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                    name VARCHAR (50) NOT NULL,
                    description TEXT NOT NULL,
                    image_URL TEXT NOT NULL,
                    brand VARCHAR (50) NOT NULL,
                    price FLOAT NOT NULL,
                    category VARCHAR (50) NOT NULL,
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                    
                );
                --DROP TABLE IF EXISTS reviews;
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
