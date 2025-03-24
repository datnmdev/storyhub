import { memo } from 'react';
import { SlideProps } from './Slide.type';

function Slide({ children }: SlideProps) {
  return <div>{children}</div>;
}

export default memo(Slide);
