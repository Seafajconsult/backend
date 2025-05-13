import { ApplicationService } from "./application.service";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { RequestWithUser } from "../../interfaces/request.interface";
export declare class ApplicationController {
    private readonly applicationService;
    constructor(applicationService: ApplicationService);
    findAll(): Promise<import("./application.schema").Application[]>;
    getMyApplications(req: RequestWithUser): Promise<import("./application.schema").Application[]>;
    findOne(id: string, req: RequestWithUser): Promise<import("./application.schema").Application>;
    create(createApplicationDto: CreateApplicationDto, req: RequestWithUser): Promise<import("./application.schema").Application>;
    update(id: string, updateApplicationDto: UpdateApplicationDto, req: RequestWithUser): Promise<import("./application.schema").Application>;
    addDocument(id: string, documentId: string, req: RequestWithUser): Promise<import("./application.schema").Application>;
    delete(id: string, req: RequestWithUser): Promise<{
        message: string;
    }>;
}
