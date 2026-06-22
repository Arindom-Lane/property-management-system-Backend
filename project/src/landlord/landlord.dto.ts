import { IsEmail , Contains, IsNotEmpty, MinLength, isNotEmpty, Matches, IsIn, contains, IsPhoneNumber, IsMobilePhone} from "class-validator";

export class LandlordDto {


    @IsEmail()
    @Contains("aiub.edu",{message:"chutiya"})
    @IsNotEmpty()
    email ?: string;

    @IsNotEmpty()
    @Matches(/^[A-Z]/,{message:"A-Z"})
    @MinLength(6,{message:"Password 6 letter"})
    pass ?: string;


    @IsIn(['male','female'],{message:"Gender"})
    gender ?: string;


    @IsMobilePhone()
    //@Matches(/^0-9+$/)
    phone ?: string;
}