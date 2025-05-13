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
exports.ApplicationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const application_schema_1 = require("./application.schema");
const user_service_1 = require("../user/user.service");
const document_service_1 = require("../document/document.service");
let ApplicationService = class ApplicationService {
    constructor(applicationModel, userService, documentService) {
        this.applicationModel = applicationModel;
        this.userService = userService;
        this.documentService = documentService;
    }
    async findAll() {
        return this.applicationModel.find().populate("studentId").populate("employerId").exec();
    }
    async findByStudent(studentId) {
        return this.applicationModel.find({ studentId }).populate("employerId").exec();
    }
    async findByEmployer(employerId) {
        return this.applicationModel.find({ employerId }).populate("studentId").exec();
    }
    async findOne(id) {
        const application = await this.applicationModel.findById(id)
            .populate("studentId")
            .populate("employerId")
            .populate("documents")
            .exec();
        if (!application) {
            throw new common_1.NotFoundException(`Application with ID ${id} not found`);
        }
        return application;
    }
    async create(studentId, createApplicationDto) {
        await this.userService.findById(createApplicationDto.employerId);
        const newApplication = new this.applicationModel({
            studentId,
            employerId: createApplicationDto.employerId,
            position: createApplicationDto.position,
            status: application_schema_1.ApplicationStatus.DRAFT,
            statusHistory: [`${new Date().toISOString()} - Application created`],
        });
        return newApplication.save();
    }
    async update(id, updateApplicationDto) {
        const application = await this.findOne(id);
        if (updateApplicationDto.position) {
            application.position = updateApplicationDto.position;
        }
        if (updateApplicationDto.status && updateApplicationDto.status !== application.status) {
            application.status = updateApplicationDto.status;
            application.statusHistory.push(`${new Date().toISOString()} - Status changed to ${updateApplicationDto.status}`);
        }
        if (updateApplicationDto.interviewDate) {
            application.interviewDate = updateApplicationDto.interviewDate;
            application.statusHistory.push(`${new Date().toISOString()} - Interview scheduled for ${updateApplicationDto.interviewDate}`);
        }
        if (updateApplicationDto.interviewNotes) {
            application.interviewNotes = updateApplicationDto.interviewNotes;
        }
        if (updateApplicationDto.offerDetails) {
            application.offerDetails = updateApplicationDto.offerDetails;
            application.statusHistory.push(`${new Date().toISOString()} - Offer details updated`);
        }
        return application.save();
    }
    async addDocument(id, documentId) {
        const application = await this.findOne(id);
        await this.documentService.findDocumentById(documentId);
        if (!application.documents.includes(documentId)) {
            application.documents.push(documentId);
            application.statusHistory.push(`${new Date().toISOString()} - Document added: ${documentId}`);
        }
        return application.save();
    }
    async delete(id) {
        const result = await this.applicationModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException(`Application with ID ${id} not found`);
        }
    }
};
exports.ApplicationService = ApplicationService;
exports.ApplicationService = ApplicationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(application_schema_1.Application.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService,
        document_service_1.DocumentService])
], ApplicationService);
//# sourceMappingURL=application.service.js.map