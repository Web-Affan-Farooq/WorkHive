## SQL queries :
#### For creating a  new table :
```sql
            CREATE TABLE IF NOT EXISTS employees (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                department TEXT,
                position TEXT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                skills TEXT[] -- array of text values
            );
```