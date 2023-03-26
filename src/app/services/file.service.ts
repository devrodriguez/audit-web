import { Injectable } from '@angular/core';

import { Storage, ref, uploadBytes, UploadResult, deleteObject } from '@angular/fire/storage'
import { GoalFile } from '../interfaces/goal-file';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private fireStorage: Storage
  ) { }

  uploadFile(file: File): Promise<UploadResult> {
    const imgRef = ref(this.fireStorage, `files/${file.name}`)
    return uploadBytes(imgRef, file)
  }

  deleteFile(file: GoalFile) :Promise<void> {
    const fileRef = ref(this.fireStorage, file.fullPath)
    return deleteObject(fileRef)
  }
}
