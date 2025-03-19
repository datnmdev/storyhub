import { LoadingProps } from "@components/Loading/Loading.type";
import { PropsWithChildren } from 'react';

export interface LoadingWrapperProps extends PropsWithChildren, LoadingProps {
  isLoading: boolean;
}
