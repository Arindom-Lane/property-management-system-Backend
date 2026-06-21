import { StaffService } from './staff.service';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    getStaffByQuery(id: string): object;
    getAllStaff(): string;
    getStaffById(id: string): object;
}
