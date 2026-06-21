import { StaffService } from './staff.service';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    getAllStaff(): string;
    getStaffById2(id: string): Object;
    getStaffByIdandNme(id: string, name: string): object;
}
