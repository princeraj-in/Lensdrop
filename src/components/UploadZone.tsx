import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { notify } from '../lib/toast';

interface UploadZoneProps {
  eventId: string;
  onUploadComplete?: (newImage: any) => void;
}

export function UploadZone({ eventId, onUploadComplete }: UploadZoneProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file: File) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lensdrop");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/djpqwrs1l/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        return {
          url: data.secure_url,
          public_id: data.public_id
        };
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setUploading(true);
    setProgress(0);
    
    let completed = 0;
    
    for (const file of acceptedFiles) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        };
        const compressedFile = await imageCompression(file, options);
        
        const uploadResult = await uploadImage(compressedFile);
        
        if (uploadResult) {
          const newImage = {
            url: uploadResult.url,
            public_id: uploadResult.public_id,
            name: file.name,
            size: compressedFile.size,
            uploadedAt: new Date().toISOString(),
            status: 'approved',
            uploaderType: 'host',
            uploaderName: 'Host'
          };
          
          try {
            await updateDoc(doc(db, 'events', eventId), {
              images: arrayUnion(newImage)
            });
            if (onUploadComplete) onUploadComplete(newImage);
          } catch (dbError) {
            console.error("Firebase update failed, saving to localStorage", dbError);
            const savedEvents = localStorage.getItem('lensdrop_events');
            if (savedEvents) {
              try {
                const parsedEvents = JSON.parse(savedEvents);
                const eventIndex = parsedEvents.findIndex((e: any) => e.id === eventId);
                if (eventIndex !== -1) {
                  parsedEvents[eventIndex].images = [...(parsedEvents[eventIndex].images || []), newImage];
                  localStorage.setItem('lensdrop_events', JSON.stringify(parsedEvents));
                  if (onUploadComplete) onUploadComplete(newImage);
                }
              } catch (e) {
                console.error('Failed to update local storage', e);
              }
            }
          }
        }
        
        completed++;
        setProgress(Math.round((completed / acceptedFiles.length) * 100));
      } catch (error) {
        console.error("Error uploading file:", file.name, error);
        notify.error(`Failed to upload ${file.name}. Please try again.`);
      }
    }
    
    setUploading(false);
    setProgress(0);
    notify.success("Upload complete!");
  }, [eventId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    }
  } as any);

  return (
    <div className="mb-8 relative z-10">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 relative z-20 pointer-events-auto
          ${isDragActive ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_30px_rgba(79,70,229,0.2)] scale-[1.02]' : 'border-gray-300 dark:border-slate-700 hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'}
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
          {isDragActive ? 'Drop photos here...' : 'Drag & drop photos here'}
        </h3>
        <p className="text-gray-500 dark:text-slate-400 text-sm">
          or click to select files (JPEG, PNG, WebP)
        </p>
      </div>

      {uploading && (
        <div className="mt-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            <span>Uploading photos...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
