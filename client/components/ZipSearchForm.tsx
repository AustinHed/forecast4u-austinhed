import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Stack, TextInput } from "@carbon/react";
import { normalizeZip } from "@/lib/zip";

export interface ZipSearchFormProps {
  initialZip?: string;
}

export default function ZipSearchForm({ initialZip = "" }: ZipSearchFormProps) {
  const [zip, setZip] = useState(initialZip);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const inputId = useId();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setZip(event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = normalizeZip(zip);
    if (!normalized) {
      setError("Enter a valid 5-digit ZIP code, such as 90210 or 90210-1234.");
      return;
    }

    setError(null);
    navigate(`/weather/${normalized}`);
  }

  return (
    <Form onSubmit={handleSubmit} aria-label="Search weather by ZIP code">
      <Stack gap={5}>
        <TextInput
          id={inputId}
          labelText="US ZIP code"
          helperText="Enter a 5-digit ZIP code, such as 90210, or a ZIP+4 like 90210-1234."
          placeholder="90210"
          value={zip}
          onChange={handleChange}
          invalid={Boolean(error)}
          invalidText={error ?? undefined}
          inputMode="numeric"
          autoComplete="postal-code"
        />
        <Button type="submit">Get forecast</Button>
      </Stack>
    </Form>
  );
}
