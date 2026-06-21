import { Injectable } from '@nestjs/common';

@Injectable()
export class StaffService {
    getAllStaff() {
        return "This will return all staff members.";
    }

    
    getStaffById2(id: string) : object{
        return {id: id, name: "John Doe", position: "Manager"};
    }

    getStaffByIdandNme(id: string, name: string) : object{
        return {id: id, name: name, position: "Staff Manager"};
    }
    
}
