import { Grid, Column, Section, Heading, Stack } from "@carbon/react";
import AppShell from "@/components/AppShell";
import ZipSearchForm from "@/components/ZipSearchForm";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export default function Index() {
  useDocumentTitle("Forecast4U \u2013 Five-day weather forecast");

  return (
    <AppShell>
      <Grid narrow className="page">
        <Column sm={4} md={8} lg={16}>
          <Stack gap={7}>
            <Section level={1}>
              <Heading>Forecast4U</Heading>
              <p>
                Enter a US ZIP code to see a rolling five-day forecast in
                three-hour increments for your area.
              </p>
            </Section>
            <ZipSearchForm />
          </Stack>
        </Column>
      </Grid>
    </AppShell>
  );
}
