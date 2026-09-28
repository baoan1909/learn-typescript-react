# Hướng dẫn khởi tạo Backend từ đầu

Tài liệu này dùng để tạo **một backend mới từ thư mục trống**, dựa trên kiến trúc của dự án hiện tại:

- Node.js + TypeScript
- Express 5
- MySQL 8 chạy bằng Docker
- Prisma 7 và MariaDB/MySQL driver adapter
- ESLint 10
- Nodemon + `ts-node` cho môi trường phát triển

Đây không phải hướng dẫn cài lại thư mục `backend` đang có. Các lệnh bên dưới giúp dựng lại một dự án tương tự trong tương lai.

## 1. Công cụ cần cài trên máy

### Bắt buộc

1. **Node.js**
   - Tối thiểu: Node `22.12`.
   - Khuyến nghị: một bản Node LTS còn được hỗ trợ, ví dụ Node 24 LTS.
   - Node đã đi kèm `npm`.

2. **Docker Desktop**
   - Trên Windows nên bật WSL 2 khi Docker Desktop yêu cầu.
   - Tài liệu này dùng Docker để chạy MySQL, vì vậy không cần cài MySQL trực tiếp vào Windows.

3. **Trình soạn thảo**
   - Khuyến nghị VS Code cùng các extension ESLint, Prisma và Docker.

Kiểm tra sau khi cài:

```bash
node --version
npm --version
docker --version
docker compose version
```

## 2. Tạo dự án Node.js mới

Từ thư mục chứa các dự án của bạn:

```bash
mkdir backend
cd backend
npm init -y
```

Cài các thư viện chạy thật:

```bash
npm install express@5 cors@2 dotenv@18 @prisma/client@7 @prisma/adapter-mariadb@7
```

Cài công cụ chỉ dùng khi phát triển:

```bash
npm install --save-dev typescript@5 ts-node@10 nodemon@3 prisma@7 @types/node @types/express @types/cors eslint@10 @eslint/js globals typescript-eslint
```

Lưu ý:

- Luôn để `prisma` và `@prisma/client` cùng major version, tốt nhất cùng chính xác một version.
- `nodemon`, `typescript` và Prisma CLI là dev dependencies; chúng không cần nằm trong dependencies của ứng dụng production.
- Dự án gốc đang dùng TypeScript 5 cho backend. Khi nâng major version, hãy chạy lại type-check và build trước khi áp dụng cho dự án thật.

## 3. Tạo cấu trúc thư mục

Tạo cấu trúc ban đầu như sau:

```text
backend/
├─ mysql-db/
│  └─ docker-compose.yml
├─ src/
│  ├─ controllers/
│  ├─ generated/          # Prisma sinh tự động, không commit
│  ├─ libs/
│  ├─ migrations/         # Prisma tạo khi migrate
│  ├─ models/
│  │  ├─ schema.prisma
│  │  └─ category.prisma
│  ├─ routes/
│  ├─ services/
│  └─ app.ts
├─ .env                   # bí mật cục bộ, không commit
├─ .env.example           # tên biến mẫu, được commit
├─ .gitignore
├─ eslint.config.mts
├─ package.json
├─ prisma.config.ts
└─ tsconfig.json
```

Bạn có thể dùng tên miền nghiệp vụ khác thay cho `category`; điểm quan trọng là giữ luồng:

```text
route -> controller -> service -> Prisma -> MySQL
```

## 4. Cấu hình TypeScript

Có thể sinh file nền bằng `npx tsc --init`, sau đó thay nội dung `tsconfig.json` bằng cấu hình gọn sau:

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "module": "commonjs",
    "moduleResolution": "node",
    "target": "ES2023",
    "types": ["node"],
    "esModuleInterop": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "sourceMap": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

## 5. Thêm scripts vào `package.json`

Giữ các thông tin khác do `npm init` tạo và đặt phần `scripts` thành:

```json
{
  "scripts": {
    "dev": "nodemon --watch src --ext ts --exec ts-node src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "prisma:format": "prisma format",
    "prisma:validate": "prisma validate",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  }
}
```

Ý nghĩa:

- `npm run dev`: tự chạy lại server khi sửa file TypeScript.
- `npm run build`: biên dịch `src` sang `dist`.
- `npm start`: chạy bản JavaScript đã build.
- `npm run typecheck`: kiểm tra kiểu dữ liệu nhưng không tạo file.

## 6. Cấu hình ESLint

Tạo `eslint.config.mts`:

```ts
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "src/generated"]),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
```

Backend phải dùng `globals.node`, không dùng `globals.browser`.

## 7. Chạy MySQL 8 bằng Docker

Tạo `mysql-db/docker-compose.yml`:

```yaml
name: ecommerce-dash-db

services:
  db:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: dev_password
      MYSQL_DATABASE: ecommerce_db
    ports:
      - "3310:3306"
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  db_data:
```

Chạy database:

```bash
docker compose -f mysql-db/docker-compose.yml up -d
docker compose -f mysql-db/docker-compose.yml ps
```

Port bên ngoài là `3310`; port bên trong container vẫn là `3306`. Mật khẩu trên chỉ dành cho máy phát triển, không dùng cho production.

Dừng database nhưng giữ dữ liệu:

```bash
docker compose -f mysql-db/docker-compose.yml down
```

Chỉ thêm `--volumes` khi thực sự muốn xóa toàn bộ dữ liệu database cục bộ.

## 8. Khai báo biến môi trường

Tạo `.env.example`:

```dotenv
PORT=3000
DATABASE_URL="mysql://root:dev_password@localhost:3310/ecommerce_db"
DATABASE_HOST="localhost"
DATABASE_PORT=3310
DATABASE_USER="root"
DATABASE_PASSWORD="dev_password"
DATABASE_NAME="ecommerce_db"
```

Sao chép thành `.env` và đổi giá trị theo máy của bạn. Trên PowerShell:

```powershell
Copy-Item .env.example .env
```

Tại sao có hai dạng cấu hình database:

- `DATABASE_URL` được Prisma CLI dùng khi validate, migrate và generate.
- Các biến `DATABASE_HOST`, `DATABASE_PORT`, ... được driver adapter dùng khi ứng dụng đang chạy.

Nếu mật khẩu có ký tự đặc biệt như `@`, `:`, `/` hoặc `#`, phần mật khẩu trong `DATABASE_URL` phải được URL-encode.

## 9. Cấu hình Prisma 7

Chạy lệnh khởi tạo cơ bản:

```bash
npx prisma init --datasource-provider mysql
```

Sau đó đặt schema trong `src/models` và tạo `prisma.config.ts`:

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./src/models",
  migrations: {
    path: "./src/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

Tên chuẩn `prisma.config.ts` giúp Prisma tự tìm cấu hình. Nếu đặt tên khác như dự án hiện tại là `prisma7.config.ts`, mọi lệnh Prisma phải thêm `--config prisma7.config.ts`.

Tạo `src/models/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "mysql"
}
```

Tạo một model mẫu trong `src/models/category.prisma`:

```prisma
model Category {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(100)
  status    Boolean  @default(true)
  createdAt DateTime @default(now()) @db.Timestamp()
  updatedAt DateTime @default(now()) @updatedAt @db.Timestamp()
}
```

Định dạng, kiểm tra, tạo migration và sinh Prisma Client:

```bash
npx prisma format
npx prisma validate
npx prisma migrate dev --name init
npx prisma generate
```

Mỗi lần thay đổi model:

```bash
npx prisma migrate dev --name ten_thay_doi
npx prisma generate
```

## 10. Kết nối Prisma trong ứng dụng

Tạo `src/libs/prisma.ts`:

```ts
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST!,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
});

export const prisma = new PrismaClient({ adapter });
```

Các dấu `!` chỉ tắt cảnh báo TypeScript, không kiểm tra biến lúc chạy. Với dự án production, nên thêm schema validation cho biến môi trường bằng thư viện như Zod.

## 11. Tạo API tối thiểu

Tạo `src/app.ts`:

```ts
import "dotenv/config";
import cors from "cors";
import express from "express";
import indexRouter from "./routes/index.route";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());
app.use("/api", indexRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

Tạo `src/routes/index.route.ts`:

```ts
import { Router } from "express";
import { prisma } from "../libs/prisma";

const router = Router();

router.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

router.get("/categories", async (_request, response, next) => {
  try {
    const categories = await prisma.category.findMany();
    response.json(categories);
  } catch (error) {
    next(error);
  }
});

export default router;
```

Khi nghiệp vụ lớn dần, chuyển xử lý từ route sang `controller` và `service` như cấu trúc dự án hiện tại.

## 12. `.gitignore` nên có

```gitignore
node_modules/
dist/
*.tsbuildinfo

.env
.env.*
!.env.example

src/generated/
.prisma/

logs/
*.log
coverage/
.DS_Store
Thumbs.db
```

Không commit `.env`, mật khẩu thật hoặc thư mục Prisma Client được sinh tự động.

## 13. Kiểm tra toàn bộ dự án mới

Chạy lần lượt:

```bash
docker compose -f mysql-db/docker-compose.yml up -d
npm run prisma:validate
npm run prisma:generate
npm run typecheck
npm run lint
npm run build
npm run dev
```

Mở các URL:

- `http://localhost:3000/api/health`
- `http://localhost:3000/api/categories`

Để kiểm tra bản production cục bộ:

```bash
npm run build
npm start
```

## 14. Lỗi thường gặp

### `Cannot resolve environment variable: DATABASE_URL`

Thêm `DATABASE_URL` vào `.env` và chắc chắn `prisma.config.ts` có `import "dotenv/config"`.

### `Can't reach database server`

Kiểm tra container và port:

```bash
docker compose -f mysql-db/docker-compose.yml ps
docker compose -f mysql-db/docker-compose.yml logs db
```

Ứng dụng chạy ngoài Docker phải kết nối `localhost:3310`, không phải `localhost:3306`.

### Không tìm thấy `../generated/prisma/client`

Chạy:

```bash
npx prisma generate
```

Sau đó kiểm tra `output` trong `schema.prisma` có trỏ đến `src/generated/prisma` hay không.

### Frontend gọi API bị lỗi CORS

Đảm bảo backend có `app.use(cors())`. Khi deploy thật, nên giới hạn `origin` về đúng domain frontend thay vì cho phép tất cả.

## Checklist dùng lại cho dự án sau

- [ ] Cài Node LTS và Docker Desktop.
- [ ] Khởi tạo `package.json`.
- [ ] Cài Express, Prisma, adapter và các type package.
- [ ] Tạo `tsconfig.json`, ESLint và scripts.
- [ ] Tạo MySQL bằng Docker Compose.
- [ ] Tạo cả `.env.example` lẫn `.env`.
- [ ] Khai báo `DATABASE_URL` cho Prisma CLI.
- [ ] Tạo schema, migrate và generate Prisma Client.
- [ ] Tạo Express app, router và health endpoint.
- [ ] Chạy type-check, lint, build và kiểm tra API.
