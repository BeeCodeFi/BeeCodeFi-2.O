import { Card } from "@/components/ui/card";
import type { AutoCheckReport as AutoCheckReportType } from "@beecodefi/schemas";

export function AutoCheckReport({ report }: { report: AutoCheckReportType }) {
  return (
    <Card className={report.passed ? "border-success/50" : "border-warn/50"}>
      <p className="mb-2 font-medium">{report.passed ? "🐝 Passed!" : "Needs a bit more work"}</p>
      {report.issues.length > 0 && (
        <ul className="space-y-1 text-sm text-text/80">
          {report.issues.map((issue) => (
            <li key={issue.code}>
              <span className="text-warn">•</span> {issue.message}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
