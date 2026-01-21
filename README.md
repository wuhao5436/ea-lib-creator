# lib-creater

## install

```
sudo npm i -g lib-creater --registry http://registry.npmjs.org
```
## using
```
lib-creater init my-lib
```

## CLI 参数（推荐）
```
lib-creater init my-lib -p my-lib -t react-ts
```

参数说明：
- `-p, --package-name`：写入 `package.json` 的包名（默认会提示输入）。
- `-t, --template`：模板名称（当前仅支持 `react-ts`）。

## 模板镜像配置
如果需要切换模板仓库，可使用：
```
lib-creater mirror https://github.com/your-org/your-template.git
```
模板默认会从镜像仓库下载到本地 `template/react-ts`。

## description
- support react and react hooks 
- support less less.modules
- support ts
- base on rollup, you can change rollup config as you will
- config ts-lint and es-lint as you will

## 最小模板结构（react-ts）

这个 CLI 的定位是“轻量级脚手架”，帮助初/中级开发快速搭建组件库起步工程。
下面是一个**最小但完整**的模板结构，重点在于：
1）上手快；2）组件规范清晰；3）TypeScript 约束明确；4）方便后续扩展。

```
my-lib/
├─ package.json                # scripts: dev/build/lint，发布配置
├─ tsconfig.json               # 库项目的 TS 约束
├─ rollup.config.js            # 构建产物：esm/cjs（可选 umd）
├─ .eslintrc.js                 # 轻量 lint 规则
├─ .prettierrc                  # 格式化规则
├─ README.md                    # 如何新增/导出组件
└─ src/
   ├─ index.ts                  # 库入口（统一导出）
   ├─ components/
   │  └─ Button/
   │     ├─ index.ts            # 组件导出
   │     ├─ Button.tsx          # 示例组件
   │     ├─ Button.types.ts     # Props 类型定义
   │     └─ Button.less         # 示例样式（可选）
   └─ styles/
      └─ variables.less         # 共享样式变量（可选）
```

### 说明
- **最小示例**：只保留一个 `Button` 组件，作为新增组件的参考模板。
- **TypeScript 优先**：每个组件显式定义 `Props` 类型。
- **统一入口**：`src/index.ts` 让导出规则对新手更清晰。
- **样式可选**：需要时再引入 less/less modules，默认保持轻量。

## 最小示例代码建议

> 目的：让新手能“看着就会写”，同时保持约束轻量。

**`src/components/Button/Button.types.ts`**
```ts
export interface ButtonProps {
  children?: React.ReactNode;
  type?: "primary" | "default";
  disabled?: boolean;
}
```

**`src/components/Button/Button.tsx`**
```tsx
import React from "react";
import type { ButtonProps } from "./Button.types";
import "./Button.less";

export const Button: React.FC<ButtonProps> = ({
  children,
  type = "default",
  disabled = false,
}) => (
  <button className={`btn btn-${type}`} disabled={disabled}>
    {children}
  </button>
);
```

**`src/components/Button/index.ts`**
```ts
export { Button } from "./Button";
export type { ButtonProps } from "./Button.types";
```

**`src/index.ts`**
```ts
export { Button } from "./components/Button";
export type { ButtonProps } from "./components/Button";
```

## 模板仓库
如果你愿意，我可以进一步把上面的结构与你的模板仓库对齐：
https://github.com/wuhao5436/react-ts-lib-template

## 生成后下一步（新手指引）

> 目标：生成后 1 分钟内跑通本地开发和构建。

1. 安装依赖
```
npm install
```

2. 本地开发（如果模板包含 dev 脚本）
```
npm run dev
```

3. 构建组件库
```
npm run build
```

## 新增组件的推荐流程

1. 新建目录：`src/components/Input/`
2. 添加文件：`Input.tsx`、`Input.types.ts`、`index.ts`
3. 在 `src/index.ts` 中导出新组件

> 目标：保持“目录结构一致 + 入口统一导出”，让团队新人更容易维护。
