// FileUploader.tsx
import React, { ReactElement, useRef } from 'react';
import styled from 'styled-components';

interface FileUploaderProps {
  children: ReactElement; // botón personalizado
  onFileChange: (files: FileList | null) => void;
}

const HiddenInput = styled.input`
  display: none;
`;

const Wrapper = styled.div`
  display: inline-block;
  cursor: pointer;
`;

export const FileUploader: React.FC<FileUploaderProps> = ({ children, onFileChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(e.target.files);
  };

  return (
    <Wrapper onClick={handleClick}>
      {children}
      <HiddenInput
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
      />
    </Wrapper>
  );
};
