import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { Upload as AntUpload } from 'antd';

export type UploadProps = ComponentPropsWithoutRef<typeof AntUpload>;
type UploadRef = ElementRef<typeof AntUpload>;

const BaseUpload = forwardRef<UploadRef, UploadProps>((props, ref) => <AntUpload ref={ref} {...props} />);

BaseUpload.displayName = 'Upload';

export const Upload = Object.assign(BaseUpload, {
  Dragger: AntUpload.Dragger,
});
