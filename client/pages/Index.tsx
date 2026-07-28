import { Grid, Column, Section, Heading } from "@carbon/react";

export default function Index() {
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
            <Heading>Forecast4U</Heading>
            <p>The weather experience is coming soon.</p>
          </Section>
        </Column>
      </Grid>
    </main>
  );
}
