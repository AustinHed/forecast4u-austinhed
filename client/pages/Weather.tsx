import { useEffect, useState } from "react";
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
import ZipSearchForm from "@/components/ZipSearchForm";
import ForecastResult from "@/components/ForecastResult";
import { normalizeZip } from "@/lib/zip";
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

export default function Weather() {
  const { zip: rawZip } = useParams<{ zip: string }>();
  const navigate = useNavigate();
  const normalizedZip = rawZip ? normalizeZip(rawZip) : null;
  const [state, setState] = useState<RequestState | null>(null);
  const [retryToken, setRetryToken] = useState(0);

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

  function handleRetry() {
    setRetryToken((token) => token + 1);
  }

  return (
    <main className="page">
      <Grid narrow>
        <Column sm={4} md={8} lg={8}>
          <Stack gap={7}>
            <Section level={1}>
              <Heading>Forecast4U</Heading>
            </Section>

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

            {normalizedZip && normalizedZip === rawZip && state?.status === "success" && (
              <ForecastResult forecast={state.forecast} />
            )}

            <ZipSearchForm initialZip={rawZip ?? ""} />
          </Stack>
        </Column>
      </Grid>
    </main>
  );
}
