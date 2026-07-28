import { Link as RouterLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Grid, Column, Section, Heading, Link } from "@carbon/react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <main className="forecast-placeholder">
      <Grid narrow>
        <Column
          sm={4}
          md={6}
          lg={8}
          className="forecast-placeholder__column"
        >
          <Section level={1}>
            <Heading>404</Heading>
            <p>Oops! Page not found.</p>
            <Link as={RouterLink} to="/">
              Return to Home
            </Link>
          </Section>
        </Column>
      </Grid>
    </main>
  );
};

export default NotFound;
