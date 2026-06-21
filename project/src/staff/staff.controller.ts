import { Controller, Get, Param } from '@nestjs/common';
import {StaffService} from './staff.service';



@Controller('staff')
export class StaffController {
    constructor(private readonly staffService: StaffService) {}

    @Get()
    getAllStaff() {
        return this.staffService.getAllStaff();
    }

    @Get(':id')
    getStaffById2(@Param('id') id: string) :Object {
        return this.staffService.getStaffById2(id);
    }
    @Get('getAllstaff/:id/getName/:name')
    getStaffByIdandNme(@Param('id') id: string, @Param('name') name: string) :object {
        return this.staffService.getStaffByIdandNme(id, name);
    }
}
