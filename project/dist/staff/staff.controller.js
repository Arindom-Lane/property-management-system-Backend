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
exports.StaffController = void 0;
const common_1 = require("@nestjs/common");
const staff_service_1 = require("./staff.service");
const staff_staffData_dto_1 = require("./staff.staffData.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const staff_staffData_dto3_1 = require("./staff.staffData.dto3");
let StaffController = class StaffController {
    staffService;
    constructor(staffService) {
        this.staffService = staffService;
    }
    getStaffByQuery(id) {
        return this.staffService.getStaffByQuery(id);
    }
    getAllStaff() {
        return this.staffService.getAllStaff();
    }
    getStaffById(id) {
        return this.staffService.getStaffById(id);
    }
    register(body) {
        return {
            message: "User Registered",
            user: body,
        };
    }
    userCategory(id, staffData) {
        return staffData;
    }
    task3(file, staffData3) {
        if (file) {
            staffData3.file = file.filename;
        }
        return {
            data: staffData3,
        };
    }
};
exports.StaffController = StaffController;
__decorate([
    (0, common_1.Get)("search"),
    __param(0, (0, common_1.Query)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], StaffController.prototype, "getStaffByQuery", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "getAllStaff", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], StaffController.prototype, "getStaffById", null);
__decorate([
    (0, common_1.Post)("register"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], StaffController.prototype, "register", null);
__decorate([
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.Post)(":id"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, staff_staffData_dto_1.staffDataDto]),
    __metadata("design:returntype", Object)
], StaffController.prototype, "userCategory", null);
__decorate([
    (0, common_1.Post)("task3"),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        fileFilter: (req, file, cb) => {
            if (file.originalname.match(/\.(pdf)$/i)) {
                cb(null, true);
            }
            else {
                cb(new multer_1.MulterError("LIMIT_UNEXPECTED_FILE", "Only pdf files are allowed"), false);
            }
        },
        limits: {
            fileSize: 1024 * 1024 * 5,
        },
        storage: (0, multer_1.diskStorage)({
            destination: "./uploads",
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname}`);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, staff_staffData_dto3_1.staffDataDto3]),
    __metadata("design:returntype", Object)
], StaffController.prototype, "task3", null);
exports.StaffController = StaffController = __decorate([
    (0, common_1.Controller)("staff"),
    __metadata("design:paramtypes", [staff_service_1.StaffService])
], StaffController);
//# sourceMappingURL=staff.controller.js.map