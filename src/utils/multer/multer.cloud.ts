import { BadRequestException } from "@nestjs/common"
import type { Request } from "express"
import multer from "multer"
import { storageEnum } from "src/common/enums"
import { fileValidation } from "./multer.fileVal"
import os from "os"
/* eslint-disable */




export const multerCloud = ({
    fileTypes = fileValidation.image,
    storeType = storageEnum.memory,
}: {
    fileTypes?: string[],
    storeType?: storageEnum

}) => {
    return {
        storage: storeType === storageEnum.memory ? multer.memoryStorage() : multer.diskStorage({
            destination: os.tmpdir(),
            filename(req: Request, file: Express.Multer.File, cb) {
                cb(null, `${Date.now()}_${file.originalname}`)
            }
        }),

        fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
            if (fileTypes.includes(file.mimetype)) {
                cb(null, true)
            } else {
                return cb(new BadRequestException("Invalid file type"))
            }
        }
    }
}