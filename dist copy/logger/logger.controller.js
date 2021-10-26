"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerController = void 0;
const common_1 = require("@nestjs/common");
const base_dto_1 = require("./dto/base.dto");
const logger_service_1 = require("./logger.service");
let LoggerController = class LoggerController {
    constructor(service) {
        this.service = service;
    }
    async index() {
        return await this.service.findAll();
    }
    async find(id) {
        return await this.service.findOne(id);
    }
    async create(body) {
        return await this.service.create(body);
    }
    async update(id, BaseLoggerDto) {
        return await this.service.update(id, BaseLoggerDto);
    }
    async delete(id) {
        return await this.service.delete(id);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoggerController.prototype, "index", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoggerController.prototype, "find", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoggerController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, base_dto_1.BaseLoggerDto]),
    __metadata("design:returntype", Promise)
], LoggerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoggerController.prototype, "delete", null);
LoggerController = __decorate([
    (0, common_1.Controller)('logger'),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], LoggerController);
exports.LoggerController = LoggerController;
//# sourceMappingURL=logger.controller.js.map