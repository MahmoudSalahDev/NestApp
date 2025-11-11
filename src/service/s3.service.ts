/* eslint-disable */

import { DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BadRequestException, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { createReadStream } from "fs";
import { storageEnum } from "src/common/enums";


@Injectable()
export class S3Service {
    private readonly s3Client: S3Client
    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION!,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
            }
        })
    }


    uploadFile = async ({
        storeType = storageEnum.memory,
        Bucket = process.env.AWS_BUCKET_NAME!,
        path = "general",
        ACL = "private" as ObjectCannedACL,
        file
    }: {

        storeType?: storageEnum,
        Bucket?: string,
        path: string,
        ACL?: ObjectCannedACL,
        file: Express.Multer.File
    }
    ): Promise<string> => {


        const command = new PutObjectCommand({
            Bucket,
            ACL,
            Key: `${process.env.APPLICATION_NAME}/${path}/${randomUUID()}_${file.originalname}`,
            Body: storeType === storageEnum.memory ? file.buffer : createReadStream(file.path),
            ContentType: file.mimetype
        })

        await this.s3Client.send(command)
        if (!command.input.Key) {
            throw new BadRequestException("Failed to upload file to s3😵")
        }

        return command.input.Key
    }



    uploadLargeFile = async (
        {
            storeType = storageEnum.memory,
            Bucket = process.env.AWS_BUCKET_NAME!,
            path = "general",
            ACL = "private" as ObjectCannedACL,
            file
        }: {

            storeType?: storageEnum,
            Bucket?: string,
            path: string,
            ACL?: ObjectCannedACL,
            file: Express.Multer.File
        }
    ): Promise<string> => {

        const upload = new Upload({
            client: this.s3Client,
            params: {
                Bucket,
                ACL,
                Key: `${process.env.APPLICATION_NAME}/${path}/${randomUUID()}_${file.originalname}`,
                Body: storeType === storageEnum.memory ? file.buffer : createReadStream(file.path),
                ContentType: file.mimetype
            }
        })

        upload.on("httpUploadProgress", (progress) => {
            console.log(progress);
        });

        const { Key } = await upload.done()
        if (!Key) {
            throw new BadRequestException("Failed to upload file to s3😵")
        }
        return Key
    }

    uploadFiles = async (
        {
            storeType = storageEnum.memory,
            Bucket = process.env.AWS_BUCKET_NAME!,
            path = "general",
            ACL = "private" as ObjectCannedACL,
            files,
            useLarge = false
        }: {

            storeType?: storageEnum,
            Bucket?: string,
            path: string,
            ACL?: ObjectCannedACL,
            files: Express.Multer.File[],
            useLarge?: boolean
        }
    ) => {


        let urls: string[] = []

        if (useLarge == true) {
            urls = await Promise.all(files.map(file => this.uploadLargeFile({ storeType, Bucket, path, ACL, file })))

        } else {
            urls = await Promise.all(files.map(file => this.uploadFile({ storeType, Bucket, path, ACL, file })))

        }

        return urls
    }


    createUploadFilePresignedUrl = async (
        {
            Bucket = process.env.APPLICATION_NAME!,
            path = "general",
            originalname,
            ContentType,
            expiresIn = 60 * 60
        }: {
            Bucket?: string,
            path?: string,
            originalname: string,
            ContentType: string,
            expiresIn?: number
        }
    ) => {
        const Key = `${process.env.APPLICATION_NAME}/${path}/${randomUUID()}_${originalname}`

        const command = new PutObjectCommand({
            Bucket,
            Key,
            ContentType
        })

        const url = await getSignedUrl(this.s3Client, command, { expiresIn })
        return { url, Key }
    }


    // get file

    getFile = async (
        {
            Bucket = process.env.AWS_BUCKET_NAME!,
            Key
        }: {
            Bucket?: string,
            Key: string
        }
    ) => {
        const command = new GetObjectCommand({
            Bucket,
            Key
        })
        return await this.s3Client.send(command)
    }


    // createGetFilePreSignedUrl
    createGetFilePreSignedUrl = async (
        {
            Bucket = process.env.AWS_BUCKET_NAME!,
            Key,
            expiresIn = 60,
            downloadName
        }: {
            Bucket?: string,
            Key: string,
            expiresIn?: number,
            downloadName?: string | undefined
        }
    ) => {

        const command = new GetObjectCommand({
            Bucket,
            Key,
            ResponseContentDisposition: downloadName ? `attachment; filename="${downloadName}"` : undefined
        })

        const url = await getSignedUrl(this.s3Client, command, { expiresIn })
        return url
    }

    //  deleteFile
    deleteFile = async (
        {
            Bucket = process.env.AWS_BUCKET_NAME!,
            Key,
        }: {
            Bucket?: string,
            Key: string,
        }
    ) => {

        const command = new DeleteObjectCommand({
            Bucket,
            Key,
        })


        return await this.s3Client.send(command)
    }

    // deleteFiles

    deleteFiles = async (
        {
            Bucket = process.env.AWS_BUCKET_NAME!,
            urls,
            Quiet = false
        }: {
            Bucket?: string,
            urls: string[],
            Quiet?: boolean
        }
    ) => {

        const command = new DeleteObjectsCommand({
            Bucket,
            Delete: {
                Objects: urls.map(url => ({ Key: url })),
                Quiet
            },
        })


        return await this.s3Client.send(command)
    }


    // listFiles


    listFiles = async (
        {
            Bucket = process.env.AWS_BUCKET_NAME!,
            path
        }: {
            Bucket?: string,
            path: string,
        }
    ) => {

        const command = new ListObjectsV2Command({
            Bucket,
            Prefix: `${process.env.APPLICATION_NAME!}/${path}/`,
        })


        return await this.s3Client.send(command)
    }

}