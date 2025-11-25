import React, { lazy, Suspense } from "react";
import { importRemote } from "@module-federation/utilities";

export interface RemoteComponentProps {
  scope: string;
  module: string;
  url: string;
}

const RemoteComponent: React.FC<RemoteComponentProps> = ({
  scope,
  module,
  url
}) => {
  // Memoize so lazy() isn’t recreated on every render
  const LazyComponent = lazy(() => importRemote({ url, scope, module }));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
};

export default RemoteComponent;
