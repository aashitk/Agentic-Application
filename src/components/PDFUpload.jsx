import Editor from '@monaco-editor/react';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AiOutlineFilePdf } from 'react-icons/ai';
import ClipLoader from 'react-spinners/ClipLoader';

const PDFUpload = () => {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState({});
  const [loading, setLoading] = useState(false);
  const [routeUrl, setRouteUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const handleExtractData = async () => {
    if (!file) return alert('Please upload a PDF file first.');
    setLoading(true);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch(
        routeUrl,
        {
          method: 'POST',
          body: formData,
          headers: {
            'authorization': `Basic ${import.meta.env.VITE_LANDING_AI_SECRET_KEY}`,
            'x-api-key': secretKey,
            'x-javelin-user': 'user_2okLrYS39kdSQZIyCStd45ntMT5',
            'x-javelin-userrole': 'superadmin',
          },
        },
      );

      const data = await response.json();
      setJsonData(data);
    } catch (error) {
      setJsonData(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center min-h-screen bg-silver-900 p-6'>
      <div className='flex gap-4 w-full h-[94vh]'>
        <div className='w-full flex flex-col items-center gap-[2rem] rounded-xl border border-blue-700 bg-white p-5 overflow-scroll'>
          <h1 className='flex items-center text-lg w-full mb-2 font-bold'>
            Document Extraction
          </h1>
          <div className='w-full flex flex-col'>
            <label htmlFor='route-url' className='mb-2'>
              Route URL
            </label>
            <input
              id='route-url'
              type='text'
              value={routeUrl}
              onChange={(e) => setRouteUrl(e.target.value)}
              className='border border-gray-300 focus:outline-none rounded-lg px-2 py-2 w-full'
            />
          </div>

          <div className='w-full flex flex-col'>
            <label htmlFor='secret-key' className='mb-2'>
              Application Secret Key
            </label>
            <input
              id='secret-key'
              type='text'
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className='border border-gray-300 focus:outline-none rounded-lg px-2 py-2 w-full'
            />
          </div>
          <div className='w-full flex flex-col'>
            <label htmlFor='upload-document' className='mb-2'>
              Upload Document
            </label>
            <div
              id='upload-document'
              {...getRootProps()}
              className={`w-[30rem] py-[3rem] bg-white border-2 border-dashed ${
                file ? 'border-primary-300' : 'border-gray-300'
              } rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all w-full`}
            >
              <input {...getInputProps()} />
              <AiOutlineFilePdf size={40} className='text-primary-300 mb-2' />
              {file ? (
                <p className='text-gray-800 font-medium text-sm flex items-center gap-2'>
                  <AiOutlineFilePdf size={20} className='text-red-600' />{' '}
                  {file.name}
                </p>
              ) : (
                <p className='text-gray-700'>
                  Drag & drop a PDF file here, or click to select one
                </p>
              )}
            </div>
          </div>
          <button
            disabled={loading || !file}
            onClick={handleExtractData}
            className={`text-white font-semibold px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all ${
              loading || !file
                ? 'bg-gray-300 hover:bg-gray-300'
                : 'bg-primary-300 hover:bg-primary-500'
            }`}
          >
            {loading ? (
              <>
                <ClipLoader size={20} color='#fff' /> Extracting
              </>
            ) : (
              'Extract Data'
            )}
          </button>
        </div>

        <div className='w-full bg-white p-4 rounded-lg shadow-md overflow-auto'>
          <Editor
            height='100%'
            language='json'
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 12,
              lineHeight: 1.4,
              tabSize: 2,
              lineNumbersMinChars: 2,
              glyphMargin: false,
              showFoldingControls: 'always',
              scrollbar: {
                horizontalSliderSize: 5,
                verticalSliderSize: 5,
                alwaysConsumeMouseWheel: false,
              },
              overviewRulerLanes: 0,
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              wrappingIndent: 'indent',
              formatOnType: true,
              formatOnPaste: true,
              tabCompletion: 'on',
              automaticLayout: true,
              bracketPairColorization: {
                enabled: true,
              },
            }}
            value={JSON.stringify(jsonData, null, 2)}
          />
        </div>
      </div>
    </div>
  );
};

export default PDFUpload;
