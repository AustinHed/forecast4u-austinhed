import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Column,
  Grid,
  Heading,
  InlineNotification,
  Loading,
  Section,
  Stack,
} from "@carbon/react";
import AppShell from "@/components/AppShell";
import ZipSearchForm from "@/components/ZipSearchForm";
import ForecastResult from "@/components/ForecastResult";
import { normalizeZip } from "@/lib/zip";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import {
  getWeatherForZip,
  WeatherError,
  type WeatherErrorKind,
  type WeatherForecast,
} from "@/lib/weather";

type RequestState =
  | { status: "loading" }
  | { status: "success"; forecast: WeatherForecast }
  | { status: "error"; kind: WeatherErrorKind };

function describeError(kind: WeatherErrorKind, zip: string) {
  if (kind === "not_found") {
    return {
      title: "No location found",
      subtitle: `We couldn't find a location for ZIP code ${zip}. Double-check the ZIP code and try again.`,
    };
  }
  return {
    title: "Forecast unavailable",
    subtitle: "We couldn't load the forecast right now. Please try again in a moment.",
  };
}

function getHeadingText(state: RequestState | null): string {
  return state?.status === "success" ? state.forecast.location.name : "Weather forecast";
}

function getDocumentTitle(state: RequestState | null): string {
  const heading = getHeadingText(state);
  return heading === "Weather forecast"
    ? "Weather forecast \u2013 Forecast4U"
    : `${heading} weather forecast \u2013 Forecast4U`;
}

export default function Weather() {
  const { zip: rawZip } = useParams<{ zip: string }>();
  const navigate = useNavigate();
  const normalizedZip = rawZip ? normalizeZip(rawZip) : null;
  const [state, setState] = useState<RequestState | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useDocumentTitle(getDocumentTitle(state));

  useEffect(() => {
    if (normalizedZip && rawZip && normalizedZip !== rawZip) {
      navigate(`/weather/${normalizedZip}`, { replace: true });
    }
  }, [rawZip, normalizedZip, navigate]);

  useEffect(() => {
    if (!normalizedZip || normalizedZip !== rawZip) {
      return;
    }

    const controller = new AbortController();
    setState({ status: "loading" });

    getWeatherForZip(normalizedZip, controller.signal)
      .then((forecast) => {
        setState({ status: "success", forecast });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        const kind = error instanceof WeatherError ? error.kind : "http_error";
        setState({ status: "error", kind });
      });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedZip, rawZip, retryToken]);

  useEffect(() => {
    if (state?.status === "success") {
      headingRef.current?.focus();
    }
  }, [state]);

  function handleRetry() {
    setRetryToken((token) => token + 1);
  }

  const searchAnotherLocation = (
    <Section>
      <Stack gap={5}>
        <Heading>Search another location</Heading>
        <ZipSearchForm initialZip={rawZip ?? ""} />
      </Stack>
    </Section>
  );

  return (
    <AppShell>
      <Grid narrow className="page">
        <Column sm={4} md={8} lg={16}>
          <Section level={1}>
            <Stack gap={5}>
              <Heading ref={headingRef} tabIndex={-1}>
                {getHeadingText(state)}
              </Heading>

              {state?.status === "success" ? (
                <ForecastResult forecast={state.forecast}>{searchAnotherLocation}</ForecastResult>
              ) : (
                <Stack gap={5}>
                  {searchAnotherLocation}

                  {!normalizedZip && (
                    <InlineNotification
                      kind="error"
                      title="Invalid ZIP code"
                      subtitle={`"${rawZip}" isn't a valid 5-digit US ZIP code.`}
                      lowContrast
                      hideCloseButton
                    />
                  )}

                  {normalizedZip && normalizedZip === rawZip && state?.status === "loading" && (
                    <div role="status">
                      <Loading small withOverlay={false} description="Loading forecast" />
                      <p>Loading the forecast for {normalizedZip}…</p>
                    </div>
                  )}

                  {normalizedZip && normalizedZip === rawZip && state?.status === "error" && (
                    <Stack gap={5}>
                      <InlineNotification
                        kind="error"
                        hideCloseButton
                        lowContrast
                        {...describeError(state.kind, normalizedZip)}
                      />
                      <Button kind="tertiary" onClick={handleRetry}>
                        Try again
                      </Button>
                    </Stack>
                  )}
                </Stack>
              )}
            </Stack>
          </Section>
        </Column>
      </Grid>
    </AppShell>
  );
}
