# Article Creator Lambda

AWS Lambda boilerplate with TypeScript. Uses a regular build (compile with `tsc`, run compiled JS)—no tsx.

## Setup

```bash
npm install
```

## Build

```bash
npm run build
```

Compiles `src/**/*.ts` to `dist/` with `tsc`. For deployment, point your Lambda runtime to `dist/handler.handler`.

## Deploy

1. Run `npm run build`.
2. Zip `dist/` and `node_modules/` (or use a deployment tool that does this).
3. Create/update the Lambda function with handler: `handler.handler`.

## Scripts

| Script        | Description              |
|---------------|--------------------------|
| `npm run build`  | Compile TypeScript to `dist/` |
| `npm run clean`  | Remove `dist/`            |
