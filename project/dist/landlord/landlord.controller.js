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
exports.LandlordController = void 0;
const common_1 = require("@nestjs/common");
const landlord_service_1 = require("./landlord.service");
let LandlordController = class LandlordController {
    landlordService;
    constructor(landlordService) {
        this.landlordService = landlordService;
    }
    getLandlord() {
        return this.landlordService.getLandlord();
    }
    getAllLandlord() {
        return this.landlordService.getAllLandlord();
    }
    getLandlordByID(id, name) {
        return this.landlordService.getLandlordByID(id, name);
    }
    getLandlordByIDandName(id, name) {
        return this.landlordService.getLandlordByIDandName(id, name);
    }
};
exports.LandlordController = LandlordController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], LandlordController.prototype, "getLandlord", null);
__decorate([
    (0, common_1.Get)('getall'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], LandlordController.prototype, "getAllLandlord", null);
__decorate([
    (0, common_1.Get)('getlandlordbyid/:myid'),
    __param(0, (0, common_1.Param)('myid')),
    __param(1, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Object)
], LandlordController.prototype, "getLandlordByID", null);
__decorate([
    (0, common_1.Get)('getlandlordbyidandname'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Object)
], LandlordController.prototype, "getLandlordByIDandName", null);
exports.LandlordController = LandlordController = __decorate([
    (0, common_1.Controller)('landlord'),
    __metadata("design:paramtypes", [landlord_service_1.LandlordService])
], LandlordController);
//# sourceMappingURL=landlord.controller.js.map