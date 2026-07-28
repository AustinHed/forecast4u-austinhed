import type { ReactElement } from "react";
import { Button, Heading, Section, Tag, Tile } from "@carbon/react";
import {
  ErrorFilled,
  InformationFilled,
  WarningAltFilled,
} from "@carbon/react/icons";
import "./WeatherAlertCard.scss";

type WeatherAlertTagType =
  | "red"
  | "magenta"
  | "purple"
  | "blue"
  | "cyan"
  | "teal"
  | "green"
  | "gray"
  | "cool-gray"
  | "warm-gray"
  | "high-contrast"
  | "outline";

export type WeatherAlertSeverity = "advisory" | "watch" | "warning";

export interface WeatherAlertCardProps {
  /** Severity level of the alert, from least to most urgent. */
  severity: WeatherAlertSeverity;
  /** Short name of the alert, e.g. "Heat advisory". */
  title: string;
  /** Details describing the alert and who it affects. */
  description: string;
  /** Human-readable window during which the alert applies. */
  effectivePeriod: string;
  /** Label for the optional action button. Only shown together with `onAction`. */
  actionLabel?: string;
  /** Handler for the optional action button. Only shown together with `actionLabel`. */
  onAction?: () => void;
  className?: string;
}

const SEVERITY_LABEL: Record<WeatherAlertSeverity, string> = {
  advisory: "Advisory",
  watch: "Watch",
  warning: "Warning",
};

const SEVERITY_ICON: Record<WeatherAlertSeverity, typeof InformationFilled> = {
  advisory: InformationFilled,
  watch: WarningAltFilled,
  warning: ErrorFilled,
};

const SEVERITY_TAG_TYPE: Record<WeatherAlertSeverity, WeatherAlertTagType> = {
  advisory: "blue",
  watch: "magenta",
  warning: "red",
};

export function WeatherAlertCard({
  severity,
  title,
  description,
  effectivePeriod,
  actionLabel,
  onAction,
  className,
}: WeatherAlertCardProps): ReactElement {
  const SeverityIcon = SEVERITY_ICON[severity];
  const showAction = Boolean(actionLabel && onAction);
  const classNames = ["weather-alert-card", `weather-alert-card--${severity}`]
    .concat(className ? [className] : [])
    .join(" ");

  return (
    <Tile className={classNames}>
      <Section>
        <div className="weather-alert-card__header">
          <SeverityIcon size={20} className="weather-alert-card__icon" />
          <Tag type={SEVERITY_TAG_TYPE[severity]} size="sm">
            {SEVERITY_LABEL[severity]}
          </Tag>
        </div>
        <Heading className="weather-alert-card__title">{title}</Heading>
        <p className="weather-alert-card__description">{description}</p>
        <p className="weather-alert-card__effective-period">
          <span className="weather-alert-card__effective-period-label">
            Effective:
          </span>{" "}
          {effectivePeriod}
        </p>
        {showAction ? (
          <Button
            kind="tertiary"
            size="sm"
            className="weather-alert-card__action"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        ) : null}
      </Section>
    </Tile>
  );
}
