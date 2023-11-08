import { IsString, IsInt, Length, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    readonly name: string;
    @Length(6, 12, {
        message(validationArguments) {
            return '密码位数6-12位'
        },
    })
    @IsString()
    readonly pwd: string;
    @IsInt()
    readonly age: number;
}
