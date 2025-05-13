import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Application, ApplicationStatus } from "./application.schema";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { UserService } from "../user/user.service";
import { DocumentService } from "../document/document.service";

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<Application>,
    private userService: UserService,
    private documentService: DocumentService,
  ) {}

  async findAll(): Promise<Application[]> {
    return this.applicationModel.find().populate("studentId").populate("employerId").exec();
  }

  async findByStudent(studentId: string): Promise<Application[]> {
    return this.applicationModel.find({ studentId }).populate("employerId").exec();
  }

  async findByEmployer(employerId: string): Promise<Application[]> {
    return this.applicationModel.find({ employerId }).populate("studentId").exec();
  }

  async findOne(id: string): Promise<Application> {
    const application = await this.applicationModel.findById(id)
      .populate("studentId")
      .populate("employerId")
      .populate("documents")
      .exec();
    
    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
    
    return application;
  }

  async create(studentId: string, createApplicationDto: CreateApplicationDto): Promise<Application> {
    // Verify employer exists
    await this.userService.findById(createApplicationDto.employerId);
    
    const newApplication = new this.applicationModel({
      studentId,
      employerId: createApplicationDto.employerId,
      position: createApplicationDto.position,
      status: ApplicationStatus.DRAFT,
      statusHistory: [`${new Date().toISOString()} - Application created`],
    });
    
    return newApplication.save();
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto): Promise<Application> {
    const application = await this.findOne(id);
    
    // Update fields
    if (updateApplicationDto.position) {
      application.position = updateApplicationDto.position;
    }
    
    if (updateApplicationDto.status && updateApplicationDto.status !== application.status) {
      application.status = updateApplicationDto.status;
      application.statusHistory.push(
        `${new Date().toISOString()} - Status changed to ${updateApplicationDto.status}`
      );
    }
    
    if (updateApplicationDto.interviewDate) {
      application.interviewDate = updateApplicationDto.interviewDate;
      application.statusHistory.push(
        `${new Date().toISOString()} - Interview scheduled for ${updateApplicationDto.interviewDate}`
      );
    }
    
    if (updateApplicationDto.interviewNotes) {
      application.interviewNotes = updateApplicationDto.interviewNotes;
    }
    
    if (updateApplicationDto.offerDetails) {
      application.offerDetails = updateApplicationDto.offerDetails;
      application.statusHistory.push(
        `${new Date().toISOString()} - Offer details updated`
      );
    }
    
    return application.save();
  }

  async addDocument(id: string, documentId: string): Promise<Application> {
    const application = await this.findOne(id);
    
    // Verify document exists
    await this.documentService.findDocumentById(documentId);
    
    // Add document if not already added
    if (!application.documents.includes(documentId)) {
      application.documents.push(documentId);
      application.statusHistory.push(
        `${new Date().toISOString()} - Document added: ${documentId}`
      );
    }
    
    return application.save();
  }

  async delete(id: string): Promise<void> {
    const result = await this.applicationModel.deleteOne({ _id: id }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
  }
}
