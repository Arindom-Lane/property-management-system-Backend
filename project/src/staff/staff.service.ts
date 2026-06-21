import { Injectable } from '@nestjs/common';

@Injectable()
export class StaffService {
  getAllStaff() {
    return 'This will return all staff members.';
  }

  getStaffById(id: string): object {
    return { id, name: 'John Doe', position: 'Manager' };
  }

  getStaffByQuery(id: string): object {
    return { id: id, name: 'Alex', position: 'Staff Manager (Found via Query)' };
  }
}