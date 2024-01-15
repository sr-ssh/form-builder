import { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

type ErrorBoundaryWrapperPropsType = {
  children: ReactNode;
  customFallback?: () => JSX.Element;
};

const EmptyErrorFallback = () => <></>;

export const ErrorBoundaryWrapper = ({
  customFallback = EmptyErrorFallback,
  children,
}: ErrorBoundaryWrapperPropsType) => (
  <ErrorBoundary FallbackComponent={customFallback}>{children}</ErrorBoundary>
);
