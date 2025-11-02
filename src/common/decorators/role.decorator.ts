import { SetMetadata } from "@nestjs/common"
import { UserRole } from "../enums"

export const RoleName = "access_roles"

export const Role=(access_roles:UserRole[])=>{
    return  SetMetadata(RoleName,access_roles)

}