import { StaffService } from "./staff.service";
import { staffDataDto } from "./staff.staffData.dto";
import { staffDataDto3 } from "./staff.staffData.dto3";
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    getStaffByQuery(id: string): object;
    getAllStaff(): string;
    getStaffById(id: string): object;
    register(body: object): object;
    userCategory(id: number, staffData: staffDataDto): any;
    task3(file: Express.Multer.File, staffData3: staffDataDto3): any;
}
