import { IsString,IsEmail , Contains, IsNotEmpty, MinLength, isNotEmpty, Matches, IsIn, contains, IsPhoneNumber, IsMobilePhone,NotContains, IsUrl, IsDate, IsDateString, IS_LENGTH, Length} from "class-validator";

export class LandlordDto {

// user 2
    @IsEmail()
    @Contains("aiub.edu",{message:"aiub.edu nai"})
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



export class LandlordDto3 {

@Matches(/^[A-Za-z0-9]+$/,{message:"no special char"})
    name ?: string;

    @IsNotEmpty()
    @Matches(/^[a-z]/,{message:"a-z"})
    @MinLength(6,{message:"Password 6 letter"})
    pass?:string;


    @IsMobilePhone()
    @Contains("01",{message:"01"})
    phone?:string;



    file ?: string;

    
}

export class LandlordDto4 {

@Matches(/^[A-Za-z]+$/,{message:"no special char"})
    name ?: string;

    @IsNotEmpty()
    @Matches(/^[a-z@/#]+$/,{message:"a-z"})
    @MinLength(6,{message:"Password 6 letter"})
    pass?:string;



    @IsDateString()
    date?:string


    @IsUrl()
    link ?:string
}

export class landlordDto1 {
    @IsString()
    @Matches(/^[A-Za-z]+$/,{message:"A-Za-z"})
    name ?: string

    @IsEmail()
    @Contains("@",{message:"@"})
    @Contains(".xyz",{message:".xyz"})
    email ?: string 

    @Length(10)
    @Matches(/^[0-9]+$/,{message:"0-10"})
    nid ?: string

    nidimg ?: string




}