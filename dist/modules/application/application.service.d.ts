import { Model } from "mongoose";
import { Application } from "./application.schema";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { UserService } from "../user/user.service";
import { DocumentService } from "../document/document.service";
export declare class ApplicationService {
    private applicationModel;
    private userService;
    private documentService;
    constructor(applicationModel: Model<Application>, userService: UserService, documentService: DocumentService);
    findAll(): Promise<Application[]>;
    findByStudent(studentId: string): Promise<Application[]>;
    findByEmployer(employerId: string): Promise<Application[]>;
    findOne(id: string): Promise<Application>;
    create(studentId: string, createApplicationDto: CreateApplicationDto): Promise<Application>;
    update(id: string, updateApplicationDto: UpdateApplicationDto): Promise<Application>;
    addDocument(id: string, documentId: string): Promise<Application>;
    delete(id: string): Promise<void>;
}
