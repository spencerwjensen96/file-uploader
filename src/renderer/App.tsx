import React, { useState } from 'react'
import { FileIcon, UploadCloudIcon, Settings2Icon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import FileUploader from '../components/FileUpload'
import Settings from '../components/Settings'
import './App.css'
import "tailwindcss/tailwind.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'upload' | 'settings'>('upload')

  return (
    <div className={cn(
      "flex h-screen",
      "bg-gray-100 dark:bg-gray-900"
    )}>
      {/* Left Sidebar */}
      <div className={cn(
        "w-64 flex flex-col",
        "bg-white dark:bg-gray-800",
        "shadow-md"
      )}>
        <div className={cn(
          "p-4",
          "border-b border-gray-200 dark:border-gray-700"
        )}>
          <h1 className={cn(
            "text-2xl font-bold",
            "text-gray-800 dark:text-white"
          )}>
            Cloud Uploader
          </h1>
        </div>
        <nav className="flex-1 p-4">
          <Button
            variant={currentPage === 'upload' ? 'secondary' : 'ghost'}
            className={cn(
              "flex w-full justify-start m-2 p-2",
              currentPage === 'upload' && "bg-gray-100 dark:bg-gray-700"
            )}
            onClick={() => setCurrentPage('upload')}
          >
            <FileIcon className="mr-2 h-4 w-4" />
            <span className="align-middle">File Upload</span>
          </Button>
        </nav>
        <div className={cn(
          "p-4",
          "border-t border-gray-200 dark:border-gray-700"
        )}>
          <Button
            variant="outline"
            className={cn(
              "flex w-full justify-start m-2 p-2",
              currentPage === 'settings' && "bg-gray-100 dark:bg-gray-700"
            )}
            onClick={() => setCurrentPage('settings')}
          >
            <Settings2Icon className="mr-2 h-4 w-4" />
            <span className="align-middle">Settings</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "flex-1 p-8 overflow-auto",
        "bg-gray-50 dark:bg-gray-900"
      )}>
        {currentPage === 'upload' ? (
          <div className="max-w-md mx-auto">
            <h2 className={cn(
              "text-2xl text-center font-bold mb-6",
              "text-gray-800 dark:text-white"
            )}>
              Upload File to Cloud
            </h2>
            <FileUploader />
            <p className={cn(
              "mt-4 text-sm text-center",
              "text-gray-600 dark:text-gray-400"
            )}>
              Drag and drop your file or click to select. Then click the upload button to send it to the cloud.
            </p>
          </div>
        ) : (
          <Settings />
        )}
      </div>
    </div>
  )
}