### 此资源由 58学课资源站 收集整理 ###
//		想要获取完整课件资料 请访问：58xueke.com
//		百万资源 畅享学习
//	
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map