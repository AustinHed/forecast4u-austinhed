import { Grid, Column, Section, Heading, Stack } from "@carbon/react";
import ZipSearchForm from "@/components/ZipSearchForm";

export default function Index() {
  return (
    <main className="page">
      <Grid narrow>
        <Column sm={4} md={6} lg={8}>
          <Stack gap={7}>
            <Section level={1}>
              <Heading>Forecast4U</Heading>
              <p>
                Enter a US ZIP code to see the five-day, three-hour forecast
                for your area.
              </p>
            </Section>
            <ZipSearchForm />
          </Stack>
        </Column>
      </Grid>
    </main>
  );
}
