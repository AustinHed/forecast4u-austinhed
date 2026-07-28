import { Link as RouterLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Grid, Column, Section, Heading, Link, Stack } from "@carbon/react";
import AppShell from "@/components/AppShell";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const NotFound = () => {
  const location = useLocation();

  useDocumentTitle("Page not found \u2013 Forecast4U");

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <AppShell>
      <Grid narrow className="page">
        <Column sm={4} md={8} lg={8}>
          <Section level={1}>
            <Stack gap={5}>
              <Heading>Page not found</Heading>
              <p>We couldn't find the page you were looking for.</p>
              <Link as={RouterLink} to="/">
                Search for a ZIP code
              </Link>
            </Stack>
          </Section>
        </Column>
      </Grid>
    </AppShell>
  );
};

export default NotFound;
