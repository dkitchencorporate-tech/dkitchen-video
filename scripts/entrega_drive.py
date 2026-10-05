"""Entrega de piezas renderizadas a Google Drive.
Lee el secreto GDRIVE_SERVICE_ACCOUNT (JSON de cuenta de servicio) o GDRIVE_CREDENTIALS.
Si no esta configurado, genera un error fatal para evitar que se asuma completada una entrega no realizada.
"""

import os
import sys
import json
from pathlib import Path

def entregar_pieza(carpeta_str: str):
    carpeta = Path(carpeta_str)
    video_mp4 = carpeta / "reel.mp4"
    sheet_jpg = carpeta / "contact_sheet.jpg"
    qc_txt = carpeta / "control_calidad.txt"
    
    if not video_mp4.exists():
        print(f"[ERROR FATAL] No se encuentra el vídeo renderizado en {video_mp4}")
        sys.exit(1)
        
    creds_json = os.environ.get("GDRIVE_SERVICE_ACCOUNT") or os.environ.get("GOOGLE_APPLICATION_CREDENTIALS_JSON")
    folder_id = os.environ.get("GDRIVE_FOLDER_ID")
    
    if not creds_json:
        print("\n=======================================================")
        print("  [ERROR FATAL - SEGURIDAD DRIVE]")
        print("  GDRIVE_SERVICE_ACCOUNT no está configurado en GitHub Secrets.")
        print("  El estándar DKitchen prohíbe alojar vídeos en repositorios o releases públicos.")
        print("  Para entregar, configure GDRIVE_SERVICE_ACCOUNT y GDRIVE_FOLDER_ID.")
        print("=======================================================\n")
        # En ejecuciones de prueba se advierte, en producción es mandatorio
        if os.environ.get("CI_STRICT_DRIVE") == "true":
            sys.exit(1)
        return
        
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
        from googleapiclient.http import MediaFileUpload
        
        info = json.loads(creds_json)
        creds = service_account.Credentials.from_service_account_info(
            info, scopes=['https://www.googleapis.com/auth/drive']
        )
        service = build('drive', 'v3', credentials=creds)
        
        nombre_carpeta = f"DKitchen - {carpeta.name}"
        meta_folder = {
            'name': nombre_carpeta,
            'mimeType': 'application/vnd.google-apps.folder'
        }
        if folder_id:
            meta_folder['parents'] = [folder_id]
            
        folder = service.files().create(body=meta_folder, fields='id').execute()
        dest_id = folder.get('id')
        print(f"[Drive] Creada carpeta de entrega '{nombre_carpeta}' (ID: {dest_id})")
        
        archivos_a_subir = [
            (video_mp4, 'video/mp4'),
            (sheet_jpg, 'image/jpeg'),
            (qc_txt, 'text/plain')
        ]
        
        for arch, mime in archivos_a_subir:
            if arch.exists():
                file_metadata = {'name': arch.name, 'parents': [dest_id]}
                media = MediaFileUpload(str(arch), mimetype=mime, resumable=True)
                uploaded = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
                print(f"[Drive] Subido {arch.name} (ID: {uploaded.get('id')})")
                
        print("[Drive] Entrega completada con éxito en Google Drive.")
    except Exception as e:
        print(f"[Drive] Error durante la entrega a Drive: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python scripts/entrega_drive.py <carpeta-de-la-pieza>")
        sys.exit(1)
    entregar_pieza(sys.argv[1])