## Setup prisma in python project 
Prisma still uses Node.js under the hood for some operations.

### ✅ Make sure you have:

- Node.js ≥ 16
- Python ≥ 3.7
- pip installed

### ✅ 2. Install the Prisma CLI
You need the Prisma CLI via Node.js.

```bash
npm install prisma --save-dev
npx prisma --version
```

### ✅ 3. Install the Python Prisma Client
This is a Python package that connects Prisma with Python.
```bash
pip install prisma
```

### ✅ 4. Initialize Prisma
Create a folder for your project and run:

```bash
npx prisma init
```

**This creates:**

**prisma/schema.prisma** → your data model

**.env** → for DB connection string

### ✅ 5. Set Up Your Database URL
In the .env file, add your DB connection (e.g., PostgreSQL):

DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

#### Supported databases:
- PostgreSQL
- MySQL
- SQLite
- SQL Server
- MongoDB (Preview)

### ✅ 6. Define Your Data Model
Edit prisma/schema.prisma:

```prisma
generator db {
  provider = "prisma-client-py"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
}
```

### ✅ 7. Generate Prisma Client
Use the Prisma CLI to generate the Python client:

```bash
npx prisma generate
```

This will create a prisma folder in your project with the Python client.

### ✅ 8. Run Migrations
Apply your schema to the database:

```bash
npx prisma migrate dev --name init
```

This will:
- Create your database tables
- Update the Prisma client

### ✅ 9. Use Prisma in Python Code
Now you can use it in Python:

```bash 
from prisma import Prisma

db = Prisma()

async def main():
    await db.connect()

    # Create a user
    user = await db.user.create(
        data={'name': 'Alice', 'email': 'alice@example.com'}
    )

    print(user)

    await db.disconnect()
To run this async code:

python
Copy
Edit
import asyncio
asyncio.run(main())
```