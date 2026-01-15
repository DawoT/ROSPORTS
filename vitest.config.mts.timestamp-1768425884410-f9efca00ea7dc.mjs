// vitest.config.mts
import { defineConfig } from 'file:///D:/ROSPORTS/node_modules/vitest/dist/config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import react from 'file:///D:/ROSPORTS/node_modules/@vitejs/plugin-react/dist/index.js';
var __vite_injected_original_import_meta_url = 'file:///D:/ROSPORTS/vitest.config.mts';
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = path.dirname(__filename);
var vitest_config_default = defineConfig({
    // @ts-ignore
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        fileParallelism: false,
        environment: 'jsdom',
        setupFiles: ['./src/tests/setup.ts'],
        globals: true,
        include: ['src/tests/**/*.test.{ts,tsx}'],
        exclude: ['legacy_backup/**/*', 'node_modules/**/*'],
    },
});
export { vitest_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy5tdHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxST1NQT1JUU1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcUk9TUE9SVFNcXFxcdml0ZXN0LmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1JPU1BPUlRTL3ZpdGVzdC5jb25maWcubXRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXN0L2NvbmZpZyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcblxuY29uc3QgX19maWxlbmFtZSA9IGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKTtcbmNvbnN0IF9fZGlybmFtZSA9IHBhdGguZGlybmFtZShfX2ZpbGVuYW1lKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcGx1Z2luczogW3JlYWN0KCldLFxuICAgIHJlc29sdmU6IHtcbiAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICB0ZXN0OiB7XG4gICAgICAgIGZpbGVQYXJhbGxlbGlzbTogZmFsc2UsXG4gICAgICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgICAgICBzZXR1cEZpbGVzOiBbJy4vc3JjL3Rlc3RzL3NldHVwLnRzJ10sXG4gICAgICAgIGdsb2JhbHM6IHRydWUsXG4gICAgICAgIGluY2x1ZGU6IFsnc3JjL3Rlc3RzLyoqLyoudGVzdC57dHMsdHN4fSddLFxuICAgICAgICBleGNsdWRlOiBbJ2xlZ2FjeV9iYWNrdXAvKiovKicsICdub2RlX21vZHVsZXMvKiovKiddLFxuICAgIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNk4sU0FBUyxvQkFBb0I7QUFDMVAsT0FBTyxVQUFVO0FBQ2pCLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8sV0FBVztBQUhrSCxJQUFNLDJDQUEyQztBQUtyTCxJQUFNLGFBQWEsY0FBYyx3Q0FBZTtBQUNoRCxJQUFNLFlBQVksS0FBSyxRQUFRLFVBQVU7QUFFekMsSUFBTyx3QkFBUSxhQUFhO0FBQUE7QUFBQSxFQUV4QixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsU0FBUztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0gsS0FBSyxLQUFLLFFBQVEsV0FBVyxPQUFPO0FBQUEsSUFDeEM7QUFBQSxFQUNKO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDRixpQkFBaUI7QUFBQSxJQUNqQixhQUFhO0FBQUEsSUFDYixZQUFZLENBQUMsc0JBQXNCO0FBQUEsSUFDbkMsU0FBUztBQUFBLElBQ1QsU0FBUyxDQUFDLDhCQUE4QjtBQUFBLElBQ3hDLFNBQVMsQ0FBQyxzQkFBc0IsbUJBQW1CO0FBQUEsRUFDdkQ7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
