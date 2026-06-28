import { LandlordService } from './landlord.service';
export declare class LandlordController {
    private readonly landlordService;
    constructor(landlordService: LandlordService);
    getLandlord(): string;
    getAllLandlord(): object;
    getLandlordByID(id: number, name: string): object;
    getLandlordByIDandName(id: number, name: string): object;
}
