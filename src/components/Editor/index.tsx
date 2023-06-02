import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ReactQuillProps } from 'react-quill';
import { editorConfig, editorUtils } from './editorConfig';
import BaseReactQuill from 'react-quill';
import { useComposedRefs } from 'hooks';
// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');

    // eslint-disable-next-line react/display-name
    return ({
      forwardedRef,
      ...props
    }: ReactQuillProps & { forwardedRef?: React.LegacyRef<BaseReactQuill> }) => {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  {
    ssr: false,
  },
);

interface EditorProps extends ReactQuillProps {
  autoFocus?: boolean;
  disableNewLineByEnter?: boolean;
}
// eslint-disable-next-line react/display-name
const Editor = React.forwardRef<BaseReactQuill, EditorProps>(
  (
    { onChange, autoFocus = false, disableNewLineByEnter = false, onKeyDown, ...props },
    forwardedRef,
  ) => {
    const isMentionOpenRef = useRef<boolean>(false);
    const editorRef = useRef<BaseReactQuill>(null);
    const composedRefs = useComposedRefs(editorRef, forwardedRef);
    useEffect(() => {
      // Do a trick to wait for editor mount to DOM
      setTimeout(() => {
        editorUtils.changeLinkPlaceholder();
        if (autoFocus) editorRef.current?.focus();
      }, 100);
    }, [autoFocus]);

    const modules = useMemo(() => {
      const moduleConfig = {
        ...editorConfig.modules,
        mention: {
          ...editorConfig.modules.mention,
          onOpen: () => {
            isMentionOpenRef.current = true;
          },
          onClose: () => {
            if (isMentionOpenRef.current) {
              setTimeout(() => {
                isMentionOpenRef.current = false;
              }, 0);
            }
          },
          onSelect: (item: any, insertItem: any) => {
            isMentionOpenRef.current = true;
            insertItem(item);
          },
        },
      };

      if (disableNewLineByEnter) {
        return moduleConfig;
      }
      const { keyboard, ...result } = moduleConfig;
      return result;
    }, [disableNewLineByEnter]);

    function handleKeyDown(event: React.KeyboardEvent) {
      if (!event.shiftKey && event.key === 'Enter' && !isMentionOpenRef.current) {
        event.preventDefault();
        if (onKeyDown) onKeyDown(event);
      }
    }

    return (
      <ReactQuill
        // forwardedRef={forwardedRef}
        forwardedRef={composedRefs}
        theme="snow"
        modules={modules}
        formats={editorConfig.formats}
        className="quill-editor"
        bounds=".quill-editor"
        onChange={onChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  },
);

export default Editor;
