# Hướng dẫn khởi tạo Frontend từ đầu

Tài liệu này dùng để tạo **một frontend mới từ thư mục trống**, dựa trên kiến trúc của dự án hiện tại:

- React 19
- TypeScript 6
- Vite 8
- Tailwind CSS 4
- shadcn/ui, Radix UI và Lucide Icons
- React Router
- TanStack Query và TanStack Table
- Axios

Đây không phải hướng dẫn cài lại thư mục `frontend` đang có. Mục tiêu là có một công thức để dựng nhanh dự án mới trong tương lai.

## 1. Công cụ cần cài trên máy

### Bắt buộc

1. **Node.js**
   - Tối thiểu: Node `22.12`.
   - Khuyến nghị: một bản Node LTS còn được hỗ trợ, ví dụ Node 24 LTS.
   - Node đã đi kèm `npm`.

2. **Trình soạn thảo**
   - Khuyến nghị VS Code cùng extension ESLint và Tailwind CSS IntelliSense.

Kiểm tra sau khi cài:

```bash
node --version
npm --version
```

## 2. Tạo React + TypeScript bằng Vite

Từ thư mục chứa các dự án:

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

Lệnh dùng `@latest` để tạo dự án mới theo template hiện hành. Nếu cần tái tạo chính xác stack của repository này, hãy giữ các major version React 19, Vite 8 và TypeScript 6 trong `package.json`.

Chạy thử ngay sau khi tạo:

```bash
npm run dev
```

Vite thường mở ở `http://localhost:5173`.

## 3. Cài các thư viện của dự án

### Routing, gọi API và quản lý server state

```bash
npm install react-router-dom@7 axios @tanstack/react-query@5 @tanstack/react-table@9
```

### Giao diện và icon

```bash
npm install tailwindcss@4 @tailwindcss/vite@4 tw-animate-css @fontsource-variable/geist lucide-react class-variance-authority cn radix-ui
```

### Type cho cấu hình Vite

```bash
npm install --save-dev @types/node
```

Các dependency ESLint, React type, Vite React plugin và TypeScript thường đã được template `react-ts` cài sẵn.

## 4. Cấu hình alias `@/`

Alias giúp import ngắn gọn:

```ts
import { Button } from "@/components/ui/button";
```

### `vite.config.ts`

Thay nội dung file bằng:

```ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

### `tsconfig.json`

Giữ project references do Vite tạo và thêm `paths`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### `tsconfig.app.json`

Trong `compilerOptions`, thêm:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Không thêm `baseUrl` khi dùng TypeScript 6. TypeScript 6 đã đánh dấu tùy chọn này là deprecated và cấu hình hiện tại của repository sẽ làm `npm run build` dừng với lỗi `TS5101`. `paths` cùng alias của Vite là đủ cho cấu trúc này.

## 5. Cài Tailwind CSS 4

Plugin đã được thêm vào `vite.config.ts` ở bước trên. Trong `src/index.css`, bắt đầu bằng:

```css
@import "tailwindcss";
```

Tailwind CSS 4 với Vite plugin không cần tạo `tailwind.config.js` cho cấu hình cơ bản.

Kiểm tra nhanh trong một component:

```tsx
export default function App() {
  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <h1 className="text-3xl font-bold">Frontend đã sẵn sàng</h1>
    </main>
  );
}
```

## 6. Khởi tạo shadcn/ui

Chạy tại thư mục `frontend`:

```bash
npx shadcn@latest init
```

Chọn các giá trị tương đương dự án hiện tại:

- Framework: Vite
- TypeScript: Yes
- Style: `radix-nova` nếu CLI hiện tại hỗ trợ; nếu tên style thay đổi, chọn style gần nhất bạn muốn dùng.
- Base color: Neutral
- CSS variables: Yes
- Global CSS: `src/index.css`
- Components alias: `@/components`
- Utils alias: `@/lib/utils`

Thêm các component đang có trong dự án mẫu:

```bash
npx shadcn@latest add button dropdown-menu input input-group table textarea
```

CLI sẽ tạo `components.json`, thư mục `src/components/ui` và bổ sung dependency cần thiết. Không nên tự sửa các component generated trước khi chạy thử build lần đầu.

Nếu muốn cấu hình tương tự repository hiện tại, `components.json` có dạng:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

Sau khi init, phần đầu của `src/index.css` thường cần các import sau:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/geist";
```

Phần CSS variables cho light/dark theme nên để CLI shadcn sinh ra theo style đã chọn.

## 7. Tạo cấu trúc ứng dụng

Cấu trúc tham khảo từ dự án hiện tại:

```text
frontend/
├─ public/
├─ src/
│  ├─ assets/
│  ├─ components/
│  │  └─ ui/              # shadcn sinh component
│  ├─ layouts/
│  │  ├─ components/
│  │  └─ MainLayout.tsx
│  ├─ lib/
│  │  ├─ axios.ts
│  │  └─ utils.ts
│  ├─ pages/
│  ├─ types/
│  ├─ App.tsx
│  ├─ index.css
│  └─ main.tsx
├─ .env                   # cấu hình cục bộ, không commit
├─ .env.example
├─ components.json
├─ eslint.config.js
├─ package.json
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts
```

## 8. Cấu hình biến môi trường cho API

Tạo `.env.example`:

```dotenv
VITE_SERVICE_API=http://localhost:3000/api
```

Sao chép thành `.env`. Trên PowerShell:

```powershell
Copy-Item .env.example .env
```

Chỉ biến có tiền tố `VITE_` mới được Vite đưa vào mã frontend. Không bao giờ đặt mật khẩu, database URL, private key hoặc secret token trong biến `VITE_`, vì người dùng trình duyệt có thể đọc được chúng.

Sau khi thay `.env`, cần khởi động lại Vite dev server.

## 9. Tạo Axios instance

Tạo `src/lib/axios.ts`:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVICE_API,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

Ví dụ gọi API:

```ts
import { api } from "@/lib/axios";

export async function getCategories() {
  const response = await api.get("/categories");
  return response.data;
}
```

Với base URL `http://localhost:3000/api`, đường dẫn cuối cùng sẽ là `http://localhost:3000/api/categories`.

## 10. Cài React Router và TanStack Query vào root

Thay `src/main.tsx` bằng:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
```

Ví dụ `src/App.tsx`:

```tsx
import { Route, Routes } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Categories from "@/pages/Categories";
import Dashboard from "@/pages/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
      </Route>
    </Routes>
  );
}
```

Ví dụ `src/layouts/MainLayout.tsx`:

```tsx
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  );
}
```

## 11. Ví dụ query có type

Tạo `src/types/category.type.ts`:

```ts
export type Category = {
  id: number;
  name: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
};
```

Trong page hoặc custom hook:

```tsx
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { Category } from "@/types/category.type";

async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>("/categories");
  return response.data;
}

export default function Categories() {
  const { data = [], isPending, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (isPending) return <p>Đang tải...</p>;
  if (isError) return <p>Không tải được dữ liệu.</p>;

  return (
    <ul>
      {data.map((category) => (
        <li key={category.id}>{category.name}</li>
      ))}
    </ul>
  );
}
```

## 12. `.gitignore` nên có

```gitignore
node_modules/
dist/
dist-ssr/
*.tsbuildinfo

.env
.env.*
!.env.example

logs/
*.log
.DS_Store
Thumbs.db
```

Repository hiện tại chưa ignore `.env` của frontend, vì vậy file này đang có thể xuất hiện là file chưa được Git theo dõi. Với dự án mới, nên dùng quy tắc trên ngay từ đầu.

## 13. Scripts cần có

Template Vite thường đã tạo:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

- `npm run dev`: server phát triển và hot reload.
- `npm run build`: type-check rồi tạo thư mục `dist`.
- `npm run lint`: kiểm tra quy tắc code.
- `npm run preview`: xem thử chính thư mục `dist`; đây không phải production server.

## 14. Kiểm tra toàn bộ dự án mới

Đảm bảo backend đang chạy tại port `3000`, sau đó:

```bash
npm run lint
npm run build
npm run dev
```

Kiểm tra:

- Trang mở được tại `http://localhost:5173`.
- Điều hướng trực tiếp giữa các route hoạt động.
- DevTools không có lỗi CORS hoặc network.
- Request gọi đúng `http://localhost:3000/api/...`.
- `npm run build` tạo được thư mục `dist`.

Xem thử bản build:

```bash
npm run preview
```

## 15. Lỗi thường gặp

### `TS5101: Option 'baseUrl' is deprecated`

Xóa `baseUrl` khỏi `tsconfig.json` và `tsconfig.app.json`. Giữ `paths` như hướng dẫn ở trên.

### `Cannot find module '@/...'`

Kiểm tra đủ cả ba nơi:

1. `resolve.alias` trong `vite.config.ts`.
2. `paths` trong `tsconfig.json`.
3. `paths` trong `tsconfig.app.json`.

Sau đó khởi động lại Vite và TypeScript server của editor.

### Tailwind class không có tác dụng

Kiểm tra `@tailwindcss/vite` đã được thêm vào `plugins` và `src/index.css` có `@import "tailwindcss";`.

### `import.meta.env.VITE_SERVICE_API` là `undefined`

Kiểm tra tên biến bắt đầu bằng `VITE_`, file `.env` nằm ở thư mục gốc frontend và dev server đã được khởi động lại.

### Gọi API bị CORS hoặc `ERR_CONNECTION_REFUSED`

- `ERR_CONNECTION_REFUSED`: backend hoặc MySQL chưa chạy, hoặc sai port.
- Lỗi CORS: backend chưa cho phép origin của frontend.
- HTTP 404: thường do thiếu `/api` trong `VITE_SERVICE_API` hoặc endpoint bị ghép sai.

### Refresh route trên hosting bị 404

`BrowserRouter` cần hosting rewrite mọi route không phải static asset về `index.html`. Cấu hình rewrite tùy nhà cung cấp hosting.

## Checklist dùng lại cho dự án sau

- [ ] Cài Node LTS.
- [ ] Tạo Vite React TypeScript project.
- [ ] Cài Router, Query, Table và Axios.
- [ ] Cài Tailwind CSS 4 và Vite plugin.
- [ ] Cấu hình alias `@/` mà không dùng `baseUrl`.
- [ ] Init shadcn/ui và thêm các component cần thiết.
- [ ] Tạo `.env.example` và ignore `.env`.
- [ ] Tạo Axios instance.
- [ ] Bọc app bằng `BrowserRouter` và `QueryClientProvider`.
- [ ] Tạo layout, pages và type theo domain.
- [ ] Chạy lint, build và kiểm tra kết nối backend.
