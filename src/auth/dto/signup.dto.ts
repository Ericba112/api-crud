import { ApiProperty } from "@nestjs/swagger"
import {IsNotEmpty, IsEmail} from "class-validator"
export class SignupDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly userName: string
    
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string
    
    @ApiProperty()
    @IsNotEmpty()
    readonly password: string
}