import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

import { ItemReport } from 'src/app/interfaces/item-report';
import { AuditService } from 'src/app/services/audit.service';

@Component({
  selector: 'app-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss']
})
export class CkeditorComponent implements OnInit {
  public itemReport: ItemReport = {} as ItemReport
  public isEditable: boolean
  public ckEditorConfig = {
    licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjE3ODIzOTksImp0aSI6IjVmZDcyOWNiLWY3NmUtNGY0Mi05YmE5LWJhMzM4OTU0NThkZSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImM3ODRiYzY5In0.ln_pPtZ0Kq_dEIhAK3i8fomlUtyOFxdzIHrefdcLg5jyZh3eojPMDzgTYmK8m3Deyy0Yb1ex3eEbg9uTDjZUZA',
    exportPdf: {
      converterOptions: {
        format: 'Letter',
        margin_top: '19mm',
        margin_bottom: '19mm',
        margin_right: '19mm',
        margin_left: '19mm',
        page_orientation: 'portrait'
      },
    },
    // Configuración adicional para el manejo de imágenes
    image: {
      toolbar: [
        'imageTextAlternative',
        'toggleImageCaption',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        '|',
        'imageResize'
      ],
      styles: [
        'full',
        'side',
        'alignLeft',
        'alignCenter',
        'alignRight'
      ],
      resizeOptions: [
        {
          name: 'imageResize:original',
          label: 'Original',
          value: null
        },
        {
          name: 'imageResize:25',
          label: '25%',
          value: '25'
        },
        {
          name: 'imageResize:50',
          label: '50%',
          value: '50'
        },
        {
          name: 'imageResize:75',
          label: '75%',
          value: '75'
        }
      ]
    }
  }
  public Editor = Editor;

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    private readonly snack: MatSnackBar,
    private readonly auditSrv: AuditService
  ) {
    console.log(inputData)
  }

  ngOnInit(): void {
    const { itemReport, isEditable } = this.inputData
    this.itemReport = itemReport
    this.isEditable = isEditable
  }

  public onReady(editor: any): void {
    const decoupledEditor = editor;
    const element = decoupledEditor.ui.getEditableElement()!;
    const parent = element.parentElement!;

    parent.insertBefore(
      decoupledEditor.ui.view.toolbar.element!,
      element
    );

    // Configurar adaptador personalizado para carga de archivos
    this.configureFileUpload(decoupledEditor);
  }

  private configureFileUpload(editor: any): void {
    // Adaptador personalizado para manejar archivos
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return {
        upload: () => {
          return new Promise((resolve, reject) => {
            loader.file.then((file: File) => {
              // Validar tipo de archivo
              if (!file.type.startsWith('image/')) {
                reject('Solo se permiten archivos de imagen');
                return;
              }

              // Validar tamaño del archivo (5MB máximo)
              const maxSize = 5 * 1024 * 1024; // 5MB
              if (file.size > maxSize) {
                reject('El archivo es demasiado grande. Máximo 5MB');
                return;
              }

              const reader = new FileReader();
              
              reader.onload = () => {
                // Crear un elemento img temporal para obtener las dimensiones
                const img = new Image();
                img.onload = () => {
                  // Crear un canvas para redimensionar si es necesario
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  
                  // Configurar dimensiones máximas
                  const maxWidth = 1200;
                  const maxHeight = 800;
                  
                  let { width, height } = img;
                  
                  // Redimensionar si es necesario
                  if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width *= ratio;
                    height *= ratio;
                  }
                  
                  canvas.width = width;
                  canvas.height = height;
                  
                  // Dibujar la imagen redimensionada
                  ctx?.drawImage(img, 0, 0, width, height);
                  
                  // Convertir a base64 con calidad optimizada
                  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                  
                  resolve({
                    default: dataUrl
                  });
                };
                
                img.onerror = () => {
                  reject('Error al procesar la imagen');
                };
                
                img.src = reader.result as string;
              };
              
              reader.onerror = () => {
                reject('Error al leer el archivo');
              };
              
              reader.readAsDataURL(file);
            }).catch((error: any) => {
              reject('Error al obtener el archivo: ' + error.message);
            });
          });
        },
        
        abort: () => {
          // No hay nada que abortar en este caso
        }
      };
    };
  }

  saveData() {
    this.auditSrv.updateItemReport(this.itemReport)
      .then(() => {
        this.presentSnack('Información guardada')
      })
      .catch(err => {
        console.error(err)
        this.presentSnack('La información no se ha guardado. Intente de nuevo')
      })
  }

  presentSnack(message: string) {
    this.snack.open(message, undefined, {
      duration: 3000
    })
  }
}
