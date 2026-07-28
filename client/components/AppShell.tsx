import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Content, Header, HeaderName, SkipToContent } from "@carbon/react";

export interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <>
      <SkipToContent />
      <Header aria-label="Forecast4U">
        <HeaderName as={RouterLink} to="/" prefix="">
          Forecast4U
        </HeaderName>
      </Header>
      <Content id="main-content" tabIndex={-1} className="app-shell__content">
        {children}
      </Content>
    </>
  );
}
