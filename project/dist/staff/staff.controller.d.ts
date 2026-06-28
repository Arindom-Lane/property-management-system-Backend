import { StaffService } from './staff.service';
import { staffDataDto } from './staff.staffData.dto';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    getStaffByQuery(id: string): object;
    getAllStaff(): string;
    getStaffById(id: string): object;
    register(body: object): object;
    creatStaffViaDTO(id: number, staffData: staffDataDto): any;
}
